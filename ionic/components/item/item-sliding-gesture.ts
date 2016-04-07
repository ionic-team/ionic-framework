import {DIRECTION_RIGHT} from '../../gestures/hammer';
import {DragGesture} from '../../gestures/drag-gesture';
import {List} from '../list/list';

import {CSS, raf, closest} from '../../util/dom';


export class ItemSlidingGesture extends DragGesture {
  canDrag: boolean = true;
  data = {};
  openItems: number = 0;
  onTap;
  onMouseOut;
  preventDrag: boolean = false;
  dragEnded: boolean = true;

  constructor(public list: List, public listEle: HTMLElement) {
    super(listEle, {
      direction: 'x',
      threshold: DRAG_THRESHOLD
    });

    this.listen();

    this.onTap = (ev) => {
      if (!isFromOptionButtons(ev.target)) {
        let didClose = this.closeOpened();
        if (didClose) {
          console.debug('tap close sliding item');
          preventDefault(ev);
        }
      }
    };

    this.onMouseOut = (ev) => {
      if (ev.target.tagName === 'ION-ITEM-SLIDING') {
        console.debug('tap close sliding item');
        this.onDragEnd(ev);
      }
    };
  }

  onDragStart(ev): boolean {
    let itemContainerEle = getItemConatiner(ev.target);
    if (!itemContainerEle) {
      console.debug('onDragStart, no itemContainerEle');
      return false;
    }

    this.closeOpened(itemContainerEle);

    let openAmout = this.getOpenAmount(itemContainerEle);
    let itemData = this.get(itemContainerEle);
    this.preventDrag = (openAmout > 0);

    if (this.preventDrag) {
      this.closeOpened();
      console.debug('onDragStart, preventDefault');
      preventDefault(ev);
      return;
    }

    itemContainerEle.classList.add('active-slide');

    this.set(itemContainerEle, 'offsetX', openAmout);
    this.set(itemContainerEle, 'startX', ev.center[this.direction]);

    this.dragEnded = false;

    return true;
  }

  onDrag(ev): boolean {
    if (this.dragEnded || this.preventDrag || Math.abs(ev.deltaY) > 30) {
      console.debug('onDrag preventDrag, dragEnded:', this.dragEnded, 'preventDrag:', this.preventDrag, 'ev.deltaY:', Math.abs(ev.deltaY));
      this.preventDrag = true;
      return;
    }

    let itemContainerEle = getItemConatiner(ev.target);
    if (!itemContainerEle || !isActive(itemContainerEle)) {
      console.debug('onDrag, no itemContainerEle');
      return;
    }

    let itemData = this.get(itemContainerEle);

    if (!itemData.optsWidth) {
      itemData.optsWidth = getOptionsWidth(itemContainerEle);
      if (!itemData.optsWidth) {
        console.debug('onDrag, no optsWidth');
        return;
      }
    }

    let x = ev.center[this.direction];
    let delta = x - itemData.startX;

    let newX = Math.max(0, itemData.offsetX - delta);

    if (newX > itemData.optsWidth) {
      // Calculate the new X position, capped at the top of the buttons
      newX = -Math.min(-itemData.optsWidth, -itemData.optsWidth + (((delta + itemData.optsWidth) * 0.4)));
    }

    if (newX > 5 && ev.srcEvent.type.indexOf('mouse') > -1 && !itemData.hasMouseOut) {
      itemContainerEle.addEventListener('mouseout', this.onMouseOut);
      itemData.hasMouseOut = true;
    }

    raf(() => {
      if (!this.dragEnded && !this.preventDrag) {
        isItemActive(itemContainerEle, true);
        this.open(itemContainerEle, newX, false);
      }
    });
  }

  onDragEnd(ev) {
    this.preventDrag = false;
    this.dragEnded = true;

    let itemContainerEle = getItemConatiner(ev.target);
    if (!itemContainerEle || !isActive(itemContainerEle)) {
      console.debug('onDragEnd, no itemContainerEle');
      return;
    }

    // If we are currently dragging, we want to snap back into place
    // The final resting point X will be the width of the exposed buttons
    let itemData = this.get(itemContainerEle);

    var restingPoint = itemData.optsWidth;

    // Check if the drag didn't clear the buttons mid-point
    // and we aren't moving fast enough to swipe open

    if (this.getOpenAmount(itemContainerEle) < (restingPoint / 2)) {

      // If we are going left but too slow, or going right, go back to resting
      if (ev.direction & DIRECTION_RIGHT || Math.abs(ev.velocityX) < 0.3) {
        restingPoint = 0;
      }
    }

    itemContainerEle.removeEventListener('mouseout', this.onMouseOut);
    itemData.hasMouseOut = false;

    raf(() => {
      this.open(itemContainerEle, restingPoint, true);
    });
  }

  closeOpened(doNotCloseEle?: HTMLElement) {
    let didClose = false;
    if (this.openItems) {
      let openItemElements = this.listEle.querySelectorAll('.active-slide');
      for (let i = 0; i < openItemElements.length; i++) {
        if (openItemElements[i] !== doNotCloseEle) {
          this.open(openItemElements[i], 0, true);
          didClose = true;
        }
      }
    }
    return didClose;
  }

  open(itemContainerEle, openAmount, isFinal) {
    let slidingEle = itemContainerEle.querySelector('ion-item,[ion-item]');
    if (!slidingEle) {
      console.debug('open, no slidingEle, openAmount:', openAmount);
      return;
    }

    this.set(itemContainerEle, 'openAmount', openAmount);

    clearTimeout(this.get(itemContainerEle).timerId);

    if (openAmount) {
      this.openItems++;

    } else {
      let timerId = setTimeout(() => {
        if (slidingEle.style[CSS.transform] === '') {
          isItemActive(itemContainerEle, false);
          this.openItems--;
        }
      }, 400);
      this.set(itemContainerEle, 'timerId', timerId);
    }

    slidingEle.style[CSS.transition] = (isFinal ? '' : 'none');
    slidingEle.style[CSS.transform] = (openAmount ? 'translate3d(' + -openAmount + 'px,0,0)' : '');

    if (isFinal) {
      if (openAmount) {
        isItemActive(itemContainerEle, true);
        this.on('tap', this.onTap);

      } else {
        this.off('tap', this.onTap);
      }
    }
  }

  getOpenAmount(itemContainerEle) {
    return this.get(itemContainerEle).openAmount || 0;
  }

  get(itemContainerEle) {
    return this.data[itemContainerEle && itemContainerEle.$ionSlide] || {};
  }

  set(itemContainerEle, key, value) {
    if (!this.data[itemContainerEle.$ionSlide]) {
      this.data[itemContainerEle.$ionSlide] = {};
    }
    this.data[itemContainerEle.$ionSlide][key] = value;
  }

  unlisten() {
    super.unlisten();
    this.listEle = null;
  }
}

function isItemActive(ele, isActive) {
  ele.classList[isActive ? 'add' : 'remove']('active-slide');
  ele.classList[isActive ? 'add' : 'remove']('active-options');
}

function preventDefault(ev) {
  console.debug('sliding item preventDefault', ev.type);
  ev.preventDefault();
}

function getItemConatiner(ele) {
  return closest(ele, 'ion-item-sliding', true);
}

function isFromOptionButtons(ele) {
  return !!closest(ele, 'ion-item-options', true);
}

function getOptionsWidth(itemContainerEle) {
  let optsEle = itemContainerEle.querySelector('ion-item-options');
  if (optsEle) {
    return optsEle.offsetWidth;
  }
}

function isActive(itemContainerEle) {
  return itemContainerEle.classList.contains('active-slide');
}


const DRAG_THRESHOLD = 20;
