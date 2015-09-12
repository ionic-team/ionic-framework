import {Menu} from '../menu';
import {SlideEdgeGesture} from 'ionic/gestures/slide-edge-gesture';


class MenuGenericGestureHandler extends SlideEdgeGesture {
  constructor(menu: Menu, targetElement, threshold) {
    super(targetElement, {
      direction: (menu.side === 'left' || menu.side === 'right') ? 'x' : 'y',
      edge: menu.side,
      threshold: threshold
    });

    this.menu = menu;
    this.listen();
  }

  // Set CSS, then wait one frame for it to apply before sliding starts
  onSlideBeforeStart(slide, ev) {
    this.menu.setProgressStart();
  }

  onSlide(slide, ev) {
    this.menu.setProgess(slide.distance / slide.max);
  }

  onSlideEnd(slide, ev) {
    let shouldComplete = (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5);
    this.menu.setProgressFinish(shouldComplete);
  }

  getElementStartPos(slide, ev) {
    return this.menu.isOpen ? slide.max : slide.min;
  }

  getSlideBoundaries() {
    return {
      min: 0,
      max: this.menu.width()
    };
  }
}


export class MenuContentGesture extends MenuGenericGestureHandler {
  constructor(menu: Menu) {
    super(menu, menu.getContentElement(), 75);
  }
  canStart(ev) {
    return this.menu.isOpen ? true : super.canStart(ev);
  }
}

export class LeftMenuGesture extends MenuContentGesture {
  constructor(menu: Menu) {
    super(menu);
  }
}

export class RightMenuGesture extends LeftMenuGesture {
  constructor(menu: Menu) {
    super(menu);
  }
  getElementStartPos(slide, ev) {
    return this.menu.isOpen ? slide.min : slide.max;
  }
  getSlideBoundaries() {
    return {
      min: -this.menu.width(),
      max: 0
    };
  }

}
