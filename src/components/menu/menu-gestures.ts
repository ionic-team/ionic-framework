import { Menu } from './menu';
import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
import { SlideData } from '../../gestures/slide-gesture';
import { assign } from '../../util/util';
import { GestureDelegate, GesturePriority } from '../../gestures/gesture-controller';

const DEGRESS_TO_RADIANS = Math.PI / 180;
const MIN_COSINE = Math.cos(40 * DEGRESS_TO_RADIANS);

/**
 * Gesture attached to the content which the menu is assigned to
 */
export class MenuContentGesture extends SlideEdgeGesture {
  gesture: GestureDelegate;

  constructor(public menu: Menu, contentEle: HTMLElement, options: any = {}) {
    super(contentEle, assign({
      direction: 'x',
      edge: menu.side,
      threshold: 0,
      maxEdgeStart: menu.maxEdgeStart || 75
    }, options));

    this.gesture = menu.gestureCtrl.create('menu-swipe', {
      priority: GesturePriority.NavigationOptional,
    });
  }

  canStart(ev: any): boolean {
    if (this.shouldStart(ev)) {
      return this.gesture.capture();
    }
    this.gesture.release();
    return false;
  }

  shouldStart(ev: any): boolean {
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

    console.debug('menu shouldCapture,', menu.side, 'isOpen', menu.isOpen, 'angle', ev.angle, 'distance', ev.distance);

    if (menu.isOpen) {
      return true;
    }

    let cosine = Math.cos(ev.angle * DEGRESS_TO_RADIANS);
    if (menu.side === 'right') {
      if (cosine < -MIN_COSINE) {
        return super.canStart(ev);
      }
    } else {
      if (cosine > MIN_COSINE) {
        return super.canStart(ev);
      }
    }
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
    ev.srcEvent.preventDefault();
    ev.preventDefault();
    this.menu.swipeProgress(stepValue);
  }

  onSlideEnd(slide: SlideData, ev: any) {
    this.gesture.release();

    let z = (this.menu.side === 'right' ? slide.min : slide.max);
    let currentStepValue = (slide.distance / z);

    z = Math.abs(z * 0.5);
    let shouldCompleteRight = (ev.velocityX >= 0)
      && (ev.velocityX > 0.2 || slide.delta > z);

    let shouldCompleteLeft = (ev.velocityX <= 0)
      && (ev.velocityX < -0.2 || slide.delta < -z);

    console.debug(
      'menu gesture, onSlide', this.menu.side,
      'distance', slide.distance,
      'delta', slide.delta,
      'velocityX', ev.velocityX,
      'min', slide.min,
      'max', slide.max,
      'shouldCompleteLeft', shouldCompleteLeft,
      'shouldCompleteRight', shouldCompleteRight,
      'currentStepValue', currentStepValue);
    this.menu.swipeEnd(shouldCompleteLeft, shouldCompleteRight, currentStepValue);
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

  unlisten() {
    this.gesture.release();
    super.unlisten();
  }

  destroy() {
    this.gesture.destroy();
    super.destroy();
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
    this.gesture.priority++;
  }
}
