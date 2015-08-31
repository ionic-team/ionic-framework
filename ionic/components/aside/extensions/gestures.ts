import {Aside} from 'ionic/components/aside/aside';
//TODO: figure out way to get rid of all the ../../../../
import {SlideEdgeGesture} from 'ionic/gestures/slide-edge-gesture';

class AsideTargetGesture extends SlideEdgeGesture {
  constructor(aside: Aside) {
    let asideElement = aside.getNativeElement();
    super(asideElement, {
      direction: (aside.side === 'left' || aside.side === 'right') ? 'x' : 'y',
      edge: aside.side,
      threshold: 0
    });
    this.aside = aside;
  }
  canStart(ev) {
    return this.aside.isOpen;
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
    this.aside.setTransform(slide.distance);
  }
  onSlideEnd(slide, ev) {
    this.aside.setSliding(false);
    if (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5) {

      this.aside.setOpen(!this.aside.isOpen);
      this.aside.setDoneTransforming(!this.aside.isOpen);

    } else {
      this.aside.setDoneTransforming(this.aside.isOpen);
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

class AsideGesture extends SlideEdgeGesture {
  constructor(aside: Aside) {
    // TODO figure out the sliding element, dont just use the parent
    let contentElement = aside.getContentElement();
    super(contentElement, {
      direction: (aside.side === 'left' || aside.side === 'right') ? 'x' : 'y',
      edge: aside.side,
      threshold: 75
    });
    this.aside = aside;
    this.slideElement = contentElement;
    this.listen();

    let contentGesture = new AsideTargetGesture(aside);
    contentGesture.listen();
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
    this.aside.setTransform(slide.distance);
  }
  onSlideEnd(slide, ev) {
    this.aside.setSliding(false);
    if (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5) {
      this.aside.setOpen(!this.aside.isOpen);
      this.aside.setDoneTransforming(!this.aside.isOpen);
    } else {
      this.aside.setDoneTransforming(false);
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
