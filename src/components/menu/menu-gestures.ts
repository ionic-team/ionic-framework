import { Menu } from './menu';
import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
import { SlideData } from '../../gestures/slide-gesture';
import { assign } from '../../util/util';
import { GestureController, GesturePriority, GESTURE_MENU_SWIPE } from '../../gestures/gesture-controller';
import { NativeRafDebouncer } from '../../util/debouncer';

/**
 * Gesture attached to the content which the menu is assigned to
 */
export class MenuContentGesture extends SlideEdgeGesture {

  constructor(
    public menu: Menu,
    contentEle: HTMLElement,
    gestureCtrl: GestureController,
    options: any = {}
  ) {
    super(contentEle, assign({
      direction: 'x',
      edge: menu.side,
      threshold: 0,
      maxEdgeStart: menu.maxEdgeStart || 50,
      zone: false,
      debouncer: new NativeRafDebouncer(),
      gesture: gestureCtrl.createGesture({
        name: GESTURE_MENU_SWIPE,
        priority: GesturePriority.MenuSwipe,
        disableScroll: true
      })
    }, options));
  }

  canStart(ev: any): boolean {
    let menu = this.menu;
    if (!menu.canSwipe()) {
      return false;
    }
    if (menu.isOpen) {
      return true;
    } else if (menu.getMenuController().getOpen()) {
      return false;
    }
    return super.canStart(ev);
  }

  // Set CSS, then wait one frame for it to apply before sliding starts
  onSlideBeforeStart(ev: any) {
    console.debug('menu gesture, onSlideBeforeStart', this.menu.side);
    this.menu.swipeStart();
  }

  onSlide(slide: SlideData, ev: any) {
    let z = (this.menu.side === 'right' ? slide.min : slide.max);
    let stepValue = (slide.distance / z);

    this.menu.swipeProgress(stepValue);
  }

  onSlideEnd(slide: SlideData, ev: any) {
    let z = (this.menu.side === 'right' ? slide.min : slide.max);
    let currentStepValue = (slide.distance / z);
    let velocity = slide.velocity;
    z = Math.abs(z * 0.5);
    let shouldCompleteRight = (velocity >= 0)
      && (velocity > 0.2 || slide.delta > z);

    let shouldCompleteLeft = (velocity <= 0)
      && (velocity < -0.2 || slide.delta < -z);

    console.debug('menu gesture, onSlideEnd', this.menu.side,
      'distance', slide.distance,
      'delta', slide.delta,
      'velocity', velocity,
      'min', slide.min,
      'max', slide.max,
      'shouldCompleteLeft', shouldCompleteLeft,
      'shouldCompleteRight', shouldCompleteRight,
      'currentStepValue', currentStepValue);

    this.menu.swipeEnd(shouldCompleteLeft, shouldCompleteRight, currentStepValue, velocity);
  }

  getElementStartPos(slide: SlideData, ev: any) {
    if (this.menu.side === 'right') {
      return this.menu.isOpen ? slide.min : slide.max;
    }
    // left menu
    return this.menu.isOpen ? slide.max : slide.min;
  }

  getSlideBoundaries(): {min: number, max: number} {
    if (this.menu.side === 'right') {
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
