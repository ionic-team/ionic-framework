import {Component, Template, Inject, Parent, NgElement} from 'angular2/angular2';
import {Ion} from '../ion';
import {Config} from '../../core/config/config';
import {SlideEdgeGesture} from '../../core/gestures/slide-edge-gesture';
import * as util from '../../util';

// AsideParent is just a temporary directive
@Component({
  selector: 'ion-aside-parent'
})
@Template({
  inline: '<content></content>'
})
export class AsideParent {
  constructor(@NgElement() element: NgElement) {
    this.domElement = element.domElement;
    super();
  }
}

@Component({
  selector: 'ion-aside',
  bind: {
    side: 'side',
    dragThreshold: 'dragThreshold'
  }
})
@Template({
  inline: `<content></content>`
})
export class Aside {
  constructor(
    @Parent() asideParent: AsideParent,
    @NgElement() element: NgElement
  ) {
    this.domElement = element.domElement;

    this.domElement.addEventListener('transitionend', ev => {
      this.setChanging(false);
    })

    // TODO: remove this. setTimeout has to be done so the bindings can be applied
    setTimeout(() => {
      let GestureConstructor = {
        left: LeftAsideSlideGesture,
        top: TopAsideSlideGesture,
        bottom: BottomAsideSlideGesture,
        right: RightAsideSlideGesture
      }[this.side];
      this.domElement.classList.add(this.side);
      this.gesture = new GestureConstructor(this, asideParent.domElement);
      this.gesture.listen();
    });
  }
  setSliding(isSliding) {
    if (isSliding !== this.isSliding) {
      this.domElement.classList[isSliding ? 'add' : 'remove']('sliding');
    }
  }
  setChanging(isChanging) {
    if (isChanging !== this.isChanging) {
      this.isChanging = isChanging;
      this.domElement.classList[isChanging ? 'add' : 'remove']('changing');
    }
  }
  setOpen(isOpen) {
    if (isOpen !== this.isOpen) {
      this.isOpen = isOpen;
      this.setChanging(true);
      requestAnimationFrame(() => {
        this.domElement.classList[isOpen ? 'add' : 'remove']('open');
      })
    }
  }
}

class AsideSlideGesture extends SlideEdgeGesture {
  constructor(aside: Aside, slideElement: Element) {
    this.aside = aside;
    super(slideElement, {
      direction: (aside.side === 'left' || aside.side === 'right') ? 'x' : 'y',
      edge: aside.side || 'left',
      threshold: /*aside.dragThreshold || */150
    });
  }
  
  canStart(ev) {
    // Only restrict edges if the aside is closed
    return this.aside.isOpen ? true : super.canStart(ev);
  }

  onSlideBeforeStart(slide, ev) {
    this.aside.setSliding(true);
    this.aside.setChanging(true);
    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    });
  }
  onSlide(slide, ev) {
    this.aside.domElement.style.transform = 'translate3d(' + slide.distance + 'px,0,0)';
  }
  onSlideEnd(slide, ev) {
    this.aside.domElement.style.transform = '';
    this.aside.setSliding(false);
    if (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5) {
      this.aside.setOpen(!this.aside.isOpen);
    }
  }

  getElementStartPos(slide, ev) {
    return this.aside.isOpen ? slide.max : slide.min;
  }
  getSlideBoundaries() {
    return {
      min: 0,
      max: this.aside.domElement.offsetWidth
    };
  }
}

class LeftAsideSlideGesture extends AsideSlideGesture {}

class RightAsideSlideGesture extends LeftAsideSlideGesture {
  getElementStartPos(slide, ev) {
    return this.aside.isOpen ? slide.min : slide.max;
  }
  getSlideBoundaries() {
    return {
      min: -this.aside.domElement.offsetWidth,
      max: 0
    };
  }

}

class TopAsideSlideGesture extends AsideSlideGesture {
  onSlide(slide, ev) {
    this.aside.domElement.style.transform = 'translate3d(0,' + slide.distance + 'px,0)';
  }
  getSlideBoundaries() {
    return {
      min: 0,
      max: this.aside.domElement.offsetHeight
    };
  }
}

class BottomAsideSlideGesture extends TopAsideSlideGesture {
  getElementStartPos(slide, ev) {
    return this.aside.isOpen ? slide.min : slide.max;
  }
  getSlideBoundaries() {
    return {
      min: -this.aside.domElement.offsetHeight,
      max: 0
    };
  }
}
