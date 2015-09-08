import {ElementRef, Host, Directive} from 'angular2/angular2';

import {Item} from 'ionic/components/item/item';
import {SlideGesture} from 'ionic/gestures/slide-gesture';

/**
 * @name ionPrimarySwipeButtons
 * @classdesc
 * Creates a swipeable button inside a list item, that is visible when the item is swiped to the left by the user. Swiped open buttons can be hidden with `setOpen(false)`.
 *
 * @example
 * TODO
 */
@Directive({
  selector: 'ion-primary-swipe-buttons'
})
export class ItemPrimarySwipeButtons {
  /**
   * @param {ElementRef} elementRef  A reference to the component's DOM element.
   * @param {Item} item  The list item containing the swipeable buttons.
   */
  constructor(
    elementRef: ElementRef,
    @Host() item: Item
  ) {
    item.primarySwipeButtons = this;
    this.ele = elementRef.nativeElement;
    this.item = item;
    this.gesture = new ItemSlideGesture(this);
    this.gesture.listen();
  }

  /**
   * @param {boolean} isOpen  Whether or not the button should be set to open/visible.
   */
  setOpen(isOpen) {
    if (isOpen !== this.isOpen) {
      this.isOpen = isOpen;
      requestAnimationFrame(() => {
        this.ele.classList[isOpen?'add':'remove'](isOpen);
      });
    }
  }
}

/**
 * TODO
 */
@Directive({
  selector: 'ion-secondary-swipe-buttons'
})
export class ItemSecondarySwipeButtons {
}

class ItemSlideGesture extends SlideGesture {
  constructor(buttons) {
    super(buttons.item.ele)
    this.buttons = buttons
  }

  getSlideBoundaries() {
    return {
      min: -this.buttons.ele.offsetWidth,
      max: 0,
    };
  }

  getElementStartPos(slide, ev) {
    return this.buttons.isOpen ? slide.max : slide.min;
  }

  onSlideBeforeStart() {
    this.buttons.ele.classList.add('changing')
    this.buttons.ele.classList.add('no-transition')
    return new Promise(resolve => {
      requestAnimationFrame(resolve)
    })
  }
  onSlide(slide, ev) {
    this.buttons.ele.style.transform = 'translate3d(' + slide.distance + 'px,0,0)';
  }
  onSlideEnd(slide, ev) {
    this.buttons.ele.style.transform = ''
    this.buttons.ele.classList.remove('no-transition')
    if (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5) {
      this.buttons.setOpen(!this.buttons.isOpen);
    }
  }

}
