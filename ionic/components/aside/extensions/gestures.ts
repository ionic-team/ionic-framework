import {Aside} from 'ionic/components/aside/aside';
//TODO: figure out way to get rid of all the ../../../../
import {SlideEdgeGesture} from 'ionic/gestures/slide-edge-gesture';

class AsideGesture extends SlideEdgeGesture {
  constructor(aside: Aside) {
    // TODO figure out the sliding element, dont just use the parent
    let slideElement = aside.getContentElement();
    super(slideElement, {
      direction: (aside.side === 'left' || aside.side === 'right') ? 'x' : 'y',
      edge: aside.side,
      threshold: 75
    });
    this.aside = aside;
    this.slideElement = slideElement;
    this.listen();
  }

  canStart(ev) {
    // Only restrict edges if the aside is closed
    return this.aside.isOpen ? true : super.canStart(ev);
  }

  // Set CSS, then wait one frame for it to apply before sliding starts
  onSlideBeforeStart(slide, ev) {
    this.aside.setSliding(true);
    this.aside.setChanging(true);
    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    });
  }
  onSlide(slide, ev) {
    this.aside.setOpenAmt(slide.distance / slide.max);
    this.aside.setTransform('translate3d(' + slide.distance + 'px,0,0)');
  }
  onSlideEnd(slide, ev) {
    this.aside.setTransform('');
    this.aside.setSliding(false);
    if (Math.abs(ev.gesture.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5) {
      this.aside.setOpen(!this.aside.isOpen);
    }
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

export class LeftAsideGesture extends AsideGesture {}

export class RightAsideGesture extends LeftAsideGesture {
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

export class TopAsideGesture extends AsideGesture {
  onSlide(slide, ev) {
    this.aside.setTransform('translate3d(0,' + slide.distance + 'px,0)');
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
