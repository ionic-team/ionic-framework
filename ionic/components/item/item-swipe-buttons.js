import {Parent, NgElement, Decorator} from 'angular2/angular2'
import {Item} from 'ionic2/components/item/item'
import {SlideGesture} from 'ionic2/gestures/slide-gesture'

@Decorator({
  selector: 'ion-primary-swipe-buttons'
})
export class ItemPrimarySwipeButtons {
  constructor(
    @NgElement() element: NgElement,
    @Parent() item: Item
  ) {
    item.primarySwipeButtons = this
    this.domElement = element.domElement
    this.parentItem = item
    this.gesture = new ItemSlideGesture(this)
    this.gesture.listen()
  }

  setOpen(isOpen) {
    if (isOpen !== this.isOpen) {
      this.isOpen = isOpen
      requestAnimationFrame(() => {
        this.domElement.classList[isOpen?'add':'remove'](isOpen)
      })
    }
  }
}

@Decorator({
  selector: 'ion-secondary-swipe-buttons'
})
export class ItemSecondarySwipeButtons {
}

class ItemSlideGesture extends SlideGesture {
  constructor(buttons) {
    super(buttons.parentItem.domElement)
    this.buttons = buttons
  }
  
  getSlideBoundaries() {
    return {
      min: -this.buttons.domElement.offsetWidth,
      max: 0,
    };
  }

  getElementStartPos(slide, ev) {
    return this.buttons.isOpen ? slide.max : slide.min;
  }

  onSlideBeforeStart() {
    this.buttons.domElement.classList.add('changing')
    this.buttons.domElement.classList.add('no-transition')
    return new Promise(resolve => {
      requestAnimationFrame(resolve)
    })
  }
  onSlide(slide, ev) {
    this.buttons.domElement.style.transform = 'translate3d(' + slide.distance + 'px,0,0)';
  }
  onSlideEnd(slide, ev) {
    this.buttons.domElement.style.transform = ''
    this.buttons.domElement.classList.remove('no-transition')
    if (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5) {
      this.buttons.setOpen(!this.buttons.isOpen);
    }
  }

}
