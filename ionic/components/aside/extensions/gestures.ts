import {Aside} from '../aside';
import {SlideEdgeGesture} from 'ionic/gestures/slide-edge-gesture';


class AsideGenericGestureHandler extends SlideEdgeGesture {
  constructor(aside: Aside, targetElement, threshold) {
    super(targetElement, {
      direction: (aside.side === 'left' || aside.side === 'right') ? 'x' : 'y',
      edge: aside.side,
      threshold: threshold
    });

    this.aside = aside;
    this.listen();
  }

  // Set CSS, then wait one frame for it to apply before sliding starts
  onSlideBeforeStart(slide, ev) {
    this.aside.setProgressStart();
  }

  onSlide(slide, ev) {
    this.aside.setProgess(slide.distance / slide.max);
  }

  onSlideEnd(slide, ev) {
    let shouldComplete = (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5);
    this.aside.setProgressFinish(shouldComplete);
  }

  getElementStartPos(slide, ev) {
    return this.aside.isOpen ? slide.max : slide.min;
  }

  getSlideBoundaries() {
    return {
      min: 0,
      max: this.aside.width()
    };
  }
}


export class AsideContentGesture extends AsideGenericGestureHandler {
  constructor(aside: Aside) {
    super(aside, aside.getContentElement(), 75);
  }
  canStart(ev) {
    return this.aside.isOpen ? true : super.canStart(ev);
  }
}

export class LeftAsideGesture extends AsideContentGesture {
  constructor(aside: Aside) {
    super(aside);
  }
}

export class RightAsideGesture extends LeftAsideGesture {
  constructor(aside: Aside) {
    super(aside);
  }
  getElementStartPos(slide, ev) {
    return this.aside.isOpen ? slide.min : slide.max;
  }
  getSlideBoundaries() {
    return {
      min: -this.aside.width(),
      max: 0
    };
  }

}

/*
 Not supported right now
export class TopAsideGesture extends AsideGesture {
  onSlide(slide, ev) {
    this.aside.setTransform(slide.distance);
  }
  getSlideBoundaries() {
    return {
      min: 0,
      max: this.aside.height()
    };
  }
}

export class BottomAsideGesture extends TopAsideGesture {
  getElementStartPos(slide, ev) {
    return this.aside.isOpen ? slide.min : slide.max;
  }
  getSlideBoundaries() {
    return {
      min: -this.aside.height(),
      max: 0
    };
  }
}
*/
