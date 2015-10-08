import {Component, Directive, View, ElementRef, NgIf, Host, Optional} from 'angular2/angular2';

import {Gesture} from 'ionic/gestures/gesture';
import {DragGesture} from 'ionic/gestures/drag-gesture';
import {Hammer} from 'ionic/gestures/hammer';
import {List} from 'ionic/components/list/list';

import * as util from 'ionic/util';

import {CSS, raf} from 'ionic/util/dom';


/**
 * @name ionItem
 * @description
 * Creates a list-item that can easily be swiped,
 * deleted, reordered, edited, and more.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item-sliding *ng-for="#item of items" (click)="itemTapped($event, item)">
 *     {{item.title}}
 *     <div class="item-note" item-right>
 *       {{item.note}}
 *     </div>
 *   </ion-item>
 * </ion-list>
 *  ```
 */
@Component({
  selector: 'ion-item-sliding,[ion-item-sliding]',
  host: {
    'class': 'item'
  },
  properties: [
    'sliding'
  ]
})
@View({
  template:
      '<ng-content select="ion-item-options"></ng-content>' +
      '<ion-item-sliding-content>' +
        '<ion-item-content>' +
          '<ng-content></ng-content>'+
        '</ion-item-content>' +
        '<ng-content select="[item-right]"></ng-content>' +
      '</ion-item-sliding-content>',
  directives: [NgIf]
})
export class ItemSliding {
  /**
   * TODO
   * @param {ElementRef} elementRef  A reference to the component's DOM element.
   */
  constructor(elementRef: ElementRef, @Optional() @Host() list: List) {
    this._isOpen = false;
    this._isSlideActive = false;
    this._isTransitioning = false;
    this._transform = '';

    this.list = list;

    this.ele = elementRef.nativeElement;
    this.swipeButtons = {};
    this.optionButtons = {};

  }

  onInit() {
    this._initSliding();
  }

  _initSliding() {
    var itemSlidingContent = this.ele.querySelector('ion-item-sliding-content');
    var itemOptionsContent = this.ele.querySelector('ion-item-options');

    console.log('List width', this.list.width());

    this.itemSlidingContent = itemSlidingContent;
    this.itemOptions = itemOptionsContent;

    this.itemWidth = this.list.width();

    this.openAmount = 0;

    this.gesture = new ItemSlideGesture(this, itemSlidingContent);
  }


  close(andStopDrag) {
    this.openAmount = 0;

    // Enable it once, it'll get disabled on the next drag
    raf(() => {
      this.enableAnimation();
      if(this.itemSlidingContent) {
        this.itemSlidingContent.style[CSS.transform] = 'translateX(0)';
      }
    });
  }
  open(amt) {
    let el = this.itemSlidingContent;
    this.openAmount = amt || 0;

    if(this.list) {
      this.list.setOpenItem(this);
    }

    if(amt === '') {
      el.style[CSS.transform] = '';
    } else {
      el.style[CSS.transform] = 'translateX(' + -amt + 'px)';
    }
  }
  isOpen() {
    return this.openAmount > 0;
  }
  getOpenAmt() {
    return this.openAmount;
  }
  getItemWidth() {
    return this.itemWidth;
  }
  disableAnimation() {
    this.itemSlidingContent.style[CSS.transition] = 'none';
  }
  enableAnimation() {
    // Clear the explicit transition, allow for CSS one to take over
    this.itemSlidingContent.style[CSS.transition] = '';
  }
  /**
   * User did a touchstart
   */
  didTouch() {
    if(this.isOpen()) {
      this.close();
      this.didClose = true;
    } else {
      let openItem = this.list.getOpenItem();
      if(openItem && openItem !== this) {
        this.didClose = true;
      }
      if(this.list) {
        this.list.closeOpenItem();
      }
    }

  }
}

class ItemSlideGesture extends DragGesture {
  constructor(item: ItemSliding, el: Element) {

    super(el, {
      direction: 'x',
      threshold: el.offsetWidth
    });

    this.el = el;
    this.item = item;
    this.canDrag = true;
    this.listen();

    this.el.addEventListener('touchstart', (e) => {
      this.item.didTouch();
      raf(() => {
        this.item.itemOptionsWidth = this.item.itemOptions && this.item.itemOptions.offsetWidth || 0;
      })
    })

    this.el.addEventListener('touchend', (e) => {
      this.item.didClose = false;
    });
    this.el.addEventListener('touchcancel', (e) => {
      this.item.didClose = false;
    });
  }

  onDragStart(ev) {
    if(this.item.didClose) { return; }

    if(!this.item.itemOptionsWidth) { return; }

    this.slide = {};

    this.slide.offsetX = this.item.getOpenAmt();
    this.slide.startX = ev.center[this.direction];
    this.slide.started = true;

    this.item.disableAnimation();
  }

  onDrag(ev) {
    if (!this.slide || !this.slide.started) return;

    this.slide.x = ev.center[this.direction];
    this.slide.delta = this.slide.x - this.slide.startX;

    let newX = Math.max(0, this.slide.offsetX - this.slide.delta);

    let buttonsWidth = this.item.itemOptionsWidth;

    if(newX > this.item.itemOptionsWidth) {
      // Calculate the new X position, capped at the top of the buttons
      newX = -Math.min(-buttonsWidth, -buttonsWidth + (((this.slide.delta + buttonsWidth) * 0.4)));
    }

    this.item.open(newX);
  }

  onDragEnd(ev) {
    if (!this.slide || !this.slide.started) return;

    let buttonsWidth = this.item.itemOptionsWidth;

    // If we are currently dragging, we want to snap back into place
    // The final resting point X will be the width of the exposed buttons
    var restingPoint = this.item.itemOptionsWidth;

    // Check if the drag didn't clear the buttons mid-point
    // and we aren't moving fast enough to swipe open
    if (this.item.openAmount < (buttonsWidth / 2)) {

      // If we are going left but too slow, or going right, go back to resting
      if (ev.direction & Hammer.DIRECTION_RIGHT) {
        // Left
        restingPoint = 0;
      } else if (Math.abs(ev.velocityX) < 0.3) {
        // Right
        restingPoint = 0;
      }
    }

    raf(() => {
      if (restingPoint === 0) {
        // Reset to zero
        this.item.open('');
        var buttons = this.item.itemOptions;
        clearTimeout(this.hideButtonsTimeout);
        this.hideButtonsTimeout = setTimeout(() => {
          buttons && buttons.classList.add('invisible');
        }, 250);
      } else {
        this.item.open(restingPoint);
      }
      this.item.enableAnimation();

      this.slide = null;
    });
  }
}
