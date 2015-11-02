import {Component, Directive, ElementRef, NgIf, Host, Optional, Renderer, NgZone} from 'angular2/angular2';

import {Gesture} from 'ionic/gestures/gesture';
import {DragGesture} from 'ionic/gestures/drag-gesture';
import {Hammer} from 'ionic/gestures/hammer';
import {List} from 'ionic/components/list/list';

import * as util from 'ionic/util';

import {CSS, raf} from 'ionic/util/dom';



@Directive({
  selector: 'ion-item-options > button,ion-item-options > [button]',
  host: {
    '(click)': 'clicked($event)'
  }
})
export class ItemSlidingOptionButton {
  constructor(elementRef: ElementRef) {
  }
  clicked(event) {
    // Don't allow the click to propagate
    event.preventDefault();
    event.stopPropagation();
  }
}

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
  selector: 'ion-item-sliding',
  inputs: [
    'sliding'
  ],
  template:
    '<ng-content select="ion-item-options"></ng-content>' +
    '<ion-item-sliding-content>' +
      '<ng-content select="[item-left]"></ng-content>' +
      '<ng-content select="[item-right]"></ng-content>' +
      '<ion-item-content>' +
        '<ng-content></ng-content>'+
      '</ion-item-content>' +
    '</ion-item-sliding-content>'
})
export class ItemSliding {
  /**
   * TODO
   * @param {ElementRef} elementRef  A reference to the component's DOM element.
   */
  constructor(elementRef: ElementRef, renderer: Renderer, @Optional() @Host() list: List, zone: NgZone) {
    this._zone = zone;
    renderer.setElementClass(elementRef, 'item', true);
    renderer.setElementAttribute(elementRef, 'tappable', '');

    this._isOpen = false;
    this._isSlideActive = false;
    this._isTransitioning = false;
    this._transform = '';

    this.list = list;

    this.elementRef = elementRef;
    this.swipeButtons = {};
    this.optionButtons = {};
  }

  onInit() {
    let ele = this.elementRef.nativeElement;
    this.itemSlidingContent = ele.querySelector('ion-item-sliding-content');
    this.itemOptions = ele.querySelector('ion-item-options');
    this.openAmount = 0;
    this._zone.runOutsideAngular(() => {
      this.gesture = new ItemSlideGesture(this, this.itemSlidingContent, this._zone);
    });
  }

  onDestroy() {
    this.gesture && this.gesture.unlisten();
    this.itemSlidingContent = this.itemOptionsContent = null;
  }

  close(andStopDrag) {
    this.openAmount = 0;

    // Enable it once, it'll get disabled on the next drag
    raf(() => {
      this.enableAnimation();
      if (this.itemSlidingContent) {
        this.itemSlidingContent.style[CSS.transform] = 'translateX(0)';
      }
    });
  }

  open(amt) {
    let el = this.itemSlidingContent;
    this.openAmount = amt || 0;

    if (this.list) {
      this.list.setOpenItem(this);
    }

    if (amt === '') {
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
    if (this.isOpen()) {
      this.close();
      this.didClose = true;

    } else {
      let openItem = this.list.getOpenItem();
      if (openItem && openItem !== this) {
        this.didClose = true;
      }
      if (this.list) {
        this.list.closeOpenItem();
      }
    }
  }
}
class ItemSlideGesture extends DragGesture {
  constructor(item: ItemSliding, el: Element, zone) {
    super(el, {
      direction: 'x',
      threshold: el.offsetWidth
    });

    this.item = item;
    this.canDrag = true;
    this.listen();

    zone.runOutsideAngular(() => {
      let touchStart = (e) => {
        this.item.didTouch();
        raf(() => {
          this.item.itemOptionsWidth = this.item.itemOptions && this.item.itemOptions.offsetWidth || 0;
        })
      };
      el.addEventListener('touchstart', touchStart);
      el.addEventListener('mousedown', touchStart);

      let touchEnd = (e) => {
        // If we have a touch end and the item is closing,
        // prevent default to stop a click from triggering
        if(this.item.didClose) {
          e.preventDefault();
        }
        this.item.didClose = false;
      };
      el.addEventListener('touchend', touchEnd);
      el.addEventListener('mouseup', touchEnd);
      el.addEventListener('mouseout', touchEnd);
      el.addEventListener('mouseleave', touchEnd);
      el.addEventListener('touchcancel', touchEnd);
    });
  }

  onDragStart(ev) {
    if (this.item.didClose) { return; }

    if (!this.item.itemOptionsWidth) { return; }

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

    if (newX > this.item.itemOptionsWidth) {
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
