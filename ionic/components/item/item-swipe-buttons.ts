import {ElementRef, Host, Directive} from 'angular2/angular2';

import {Item} from 'ionic/components/item/item';
import {SlideGesture} from 'ionic/gestures/slide-gesture';


@Directive({
  selector: 'ion-primary-swipe-buttons'
})
export class ItemPrimarySwipeButtons {
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

  setOpen(isOpen) {
    if (isOpen !== this.isOpen) {
      this.isOpen = isOpen;
      requestAnimationFrame(() => {
        this.ele.classList[isOpen?'add':'remove'](isOpen);
      });
    }
  }
}

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
