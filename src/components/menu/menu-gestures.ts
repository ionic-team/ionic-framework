import {Menu} from './menu';
import {SlideEdgeGesture} from '../../gestures/slide-edge-gesture';
import {SlideData} from '../../gestures/slide-gesture';
import {assign} from '../../util/util';


/**
 * Gesture attached to the content which the menu is assigned to
 */
export class MenuContentGesture extends SlideEdgeGesture {

  constructor(public menu: Menu, contentEle: HTMLElement, options: any = {}) {

    super(contentEle, assign({
      direction: 'x',
      edge: menu.side,
      threshold: 0,
      maxEdgeStart: menu.maxEdgeStart || 75
    }, options));
  }

  canStart(ev: any) {
    let menu = this.menu;

    if (!menu.enabled || !menu.swipeEnabled) {
      console.debug('menu can not start, isEnabled:', menu.enabled, 'isSwipeEnabled:', menu.swipeEnabled, 'side:', menu.side);
      return false;
    }

    if (ev.distance > 50) {
      // the distance is longer than you'd expect a side menu swipe to be
      console.debug('menu can not start, distance too far:', ev.distance, 'side:', menu.side);
      return false;
    }

    console.debug('menu canStart,', menu.side, 'isOpen', menu.isOpen, 'angle', ev.angle, 'distance', ev.distance);

    if (menu.side === 'right') {
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

    } else {
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

    }

    // didn't pass the test, don't open this menu
    return false;
  }

  // Set CSS, then wait one frame for it to apply before sliding starts
  onSlideBeforeStart(slide: SlideData, ev: any) {
    console.debug('menu gesture, onSlideBeforeStart', this.menu.side);
    this.menu.swipeStart();
  }

  onSlide(slide: SlideData, ev: any) {
    let z = (this.menu.side === 'right' ? slide.min : slide.max);
    let stepValue = (slide.distance / z);
    console.debug('menu gesture, onSlide', this.menu.side, 'distance', slide.distance, 'min', slide.min, 'max', slide.max, 'z', z, 'stepValue', stepValue);

    this.menu.swipeProgress(stepValue);
  }

  onSlideEnd(slide: SlideData, ev: any) {
    let z = (this.menu.side === 'right' ? slide.min : slide.max);

    let shouldComplete = (Math.abs(ev.velocityX) > 0.2) ||
                         (Math.abs(slide.delta) > Math.abs(z) * 0.5);

    let currentStepValue = (slide.distance / z);

    console.debug('menu gesture, onSlide', this.menu.side, 'distance', slide.distance, 'delta', slide.delta, 'velocityX', ev.velocityX, 'min', slide.min, 'max', slide.max, 'shouldComplete', shouldComplete, 'currentStepValue', currentStepValue);

    this.menu.swipeEnd(shouldComplete, currentStepValue);
  }

  getElementStartPos(slide: SlideData, ev: any) {
    if (this.menu.side === 'right') {
      // right menu
      return this.menu.isOpen ? slide.min : slide.max;
    }

    // left menu
    return this.menu.isOpen ? slide.max : slide.min;
  }

  getSlideBoundaries(): {min: number, max: number} {
    if (this.menu.side === 'right') {
      // right menu
      return {
        min: -this.menu.width(),
        max: 0
      };
    }

    // left menu
    return {
      min: 0,
      max: this.menu.width()
    };
  }
}


/**
 * Gesture attached to the actual menu itself
 */
export class MenuTargetGesture extends MenuContentGesture {
  constructor(menu: Menu, menuEle: HTMLElement) {
    super(menu, menuEle, {
      maxEdgeStart: 0
    });
  }
}
