import {Hammer} from 'ionic/gestures/hammer';
import {DragGesture} from 'ionic/gestures/drag-gesture';
import {List} from '../list/list';

import * as util from 'ionic/util';
import {CSS, raf, closest} from 'ionic/util/dom';


export class ItemSlidingGesture extends DragGesture {
  constructor(list: List, listEle) {
    super(listEle, {
      direction: 'x',
      threshold: list.width()
    });

    this.data = {};
    this.openItems = 0;

    this.list = list;
    this.listEle = listEle;
    this.canDrag = true;
    this.listen();

    this.on('tap', ev => {
      if (!isFromOptionButtons(ev.target)) {
        let didClose = this.closeOpened();
        if (didClose) {
          ev.preventDefault();
        }
      }
    });
  }

  onDragStart(ev) {
    let itemContainerEle = getItemConatiner(ev.target);
    if (!itemContainerEle) return;

    this.closeOpened(ev, itemContainerEle);

    let openAmout = this.getOpenAmount(itemContainerEle);
    let itemData = this.getData(itemContainerEle);

    if (openAmout) {
      return ev.preventDefault();
    }

    itemContainerEle.classList.add('active-slide');

    this.setData(itemContainerEle, 'offsetX', openAmout);
    this.setData(itemContainerEle, 'startX', ev.center[this.direction]);
  }

  onDrag(ev) {
    let itemContainerEle = getItemConatiner(ev.target);
    if (!itemContainerEle || !isActive(itemContainerEle)) return;

    let itemData = this.getData(itemContainerEle);

    if (!itemData.optsWidth) {
      itemData.optsWidth = getOptionsWidth(itemContainerEle);
      if (!itemData.optsWidth) return;
    }

    let x = ev.center[this.direction];
    let delta = x - itemData.startX;

    let newX = Math.max(0, itemData.offsetX - delta);

    if (newX > itemData.optsWidth) {
      // Calculate the new X position, capped at the top of the buttons
      newX = -Math.min(-itemData.optsWidth, -itemData.optsWidth + (((delta + itemData.optsWidth) * 0.4)));
    }

    this.open(itemContainerEle, newX, false);
  }

  onDragEnd(ev) {
    let itemContainerEle = getItemConatiner(ev.target);
    if (!itemContainerEle || !isActive(itemContainerEle)) return;

    // If we are currently dragging, we want to snap back into place
    // The final resting point X will be the width of the exposed buttons
    let itemData = this.getData(itemContainerEle);

    var restingPoint = itemData.optsWidth;

    // Check if the drag didn't clear the buttons mid-point
    // and we aren't moving fast enough to swipe open

    if (this.getOpenAmount(itemContainerEle) < (restingPoint / 2)) {

      // If we are going left but too slow, or going right, go back to resting
      if (ev.direction & Hammer.DIRECTION_RIGHT) {
        // Left
        restingPoint = 0;

      } else if (Math.abs(ev.velocityX) < 0.3) {
        // Right
        restingPoint = 0;
      }
    }

    this.setData(itemContainerEle, 'opened', restingPoint > 0);

    raf(() => {
      this.open(itemContainerEle, restingPoint, true);
    });
  }

  closeOpened(ev, doNotCloseEle) {
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

  open(itemContainerEle, openAmount, animate) {
    let slidingEle = itemContainerEle.querySelector('ion-item');
    if (!slidingEle) return;

    this.setData(itemContainerEle, 'openAmount', openAmount);

    clearTimeout(this.getData(itemContainerEle).timerId);

    if (openAmount > 0) {
      this.openItems++;

    } else {
      let timerId = setTimeout(() => {
        if (slidingEle.style[CSS.transform] === '') {
          itemContainerEle.classList.remove('active-slide');
          this.openItems--;
        }
      }, 400);
      this.setData(itemContainerEle, 'timerId', timerId);
    }

    slidingEle.style[CSS.transform] = (openAmount === 0 ? '' : 'translate3d(' + -openAmount + 'px,0,0)');
    slidingEle.style[CSS.transition] = (animate ? '' : 'none');
  }

  getOpenAmount(itemContainerEle) {
    return this.getData(itemContainerEle).openAmount || 0;
  }

  getData(itemContainerEle) {
    return this.data[itemContainerEle && itemContainerEle.$ionSlide] || {};
  }

  setData(itemContainerEle, key, value) {
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
