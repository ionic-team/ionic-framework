import {Menu} from './menu';
import {SlideEdgeGesture} from '../../gestures/slide-edge-gesture';

import {assign} from '../../util/util';

export class MenuContentGesture extends SlideEdgeGesture {

  constructor(public menu: Menu, targetEl: Element, options = {}) {

    super(targetEl, assign({
      direction: (menu.side === 'left' || menu.side === 'right') ? 'x' : 'y',
      edge: menu.side,
      threshold: 0,
      maxEdgeStart: menu.maxEdgeStart || 75
    }, options));

    this.listen();
  }

  canStart(ev) {
    let menu = this.menu;

    console.debug('menu canStart,', menu.side, 'isOpen', menu.isOpen, 'angle', ev.angle, 'distance', ev.distance);

    if (!menu.isEnabled || !menu.isSwipeEnabled) {
      console.debug('menu canStart, isEnabled', menu.isEnabled, 'isSwipeEnabled', menu.isSwipeEnabled, 'side', menu.side);
      return false;
    }

    if (ev.distance > 50) {
      // the distance is longer than you'd expect a side menu swipe to be
      console.debug('menu canStart, distance too far', ev.distance, 'side', menu.side);
      return false;
    }


    if (menu.side === 'left') {
      // left side
      if (menu.isOpen) {
        // left side, opened
        return true;

      } else {
        // left side, closed
        if (ev.angle > -40 && ev.angle < 40) {
          return super.canStart(ev);
        }
      }

    } else if (menu.side === 'right') {
      // right side
      if (menu.isOpen) {
        // right side, opened
        return true;

      } else {
        // right side, closed
        if ((ev.angle > 140 && ev.angle <= 180) || (ev.angle > -140 && ev.angle <= -180)) {
          return super.canStart(ev);
        }
      }
    }

    // didn't pass the test, don't open this menu
    return false;
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
    this.menu.setProgressEnd(shouldComplete);
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


/**
 * Support dragging the target menu as well as the content.
 */
export class TargetGesture extends MenuContentGesture {
  constructor(menu: Menu) {
    super(menu, menu.getNativeElement(), {
      maxEdgeStart: 0
    });
  }
}

export class LeftMenuGesture extends MenuContentGesture {
  constructor(menu: Menu) {
    super(menu, menu.getContentElement());
  }
}

export class RightMenuGesture extends MenuContentGesture {
  constructor(menu: Menu) {
    super(menu, menu.getContentElement());
  }

  onSlide(slide, ev) {
    this.menu.setProgess(slide.distance / slide.min);
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
