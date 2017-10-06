import { Menu } from './menu';
import { DomController } from '../../platform/dom-controller';
import { GESTURE_MENU_SWIPE, GESTURE_PRIORITY_MENU_SWIPE, GestureController } from '../../gestures/gesture-controller';
import { Platform } from '../../platform/platform';
import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
import { SlideData } from '../../gestures/slide-gesture';

/**
 * Gesture attached to the content which the menu is assigned to
 */
export class MenuContentGesture extends SlideEdgeGesture {

  constructor(
    plt: Platform,
    public menu: Menu,
    gestureCtrl: GestureController,
    domCtrl: DomController,
  ) {
    super(plt, plt.doc().body, {
      direction: 'x',
      edge: menu.side,
      threshold: 5,
      maxEdgeStart: menu.maxEdgeStart || 50,
      zone: false,
      passive: true,
      domController: domCtrl,
      gesture: gestureCtrl.createGesture({
        name: GESTURE_MENU_SWIPE,
        priority: GESTURE_PRIORITY_MENU_SWIPE,
        disableScroll: true
      })
    });
  }

  canStart(ev: any): boolean {
    const menu = this.menu;
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
  onSlideBeforeStart() {
    console.debug('menu gesture, onSlideBeforeStart', this.menu.side);
    this.menu._swipeBeforeStart();
  }

  onSlideStart() {
    console.debug('menu gesture, onSlideStart', this.menu.side);
    this.menu._swipeStart();
  }

  onSlide(slide: SlideData) {
    const z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
    const stepValue = (slide.distance / z);

    this.menu._swipeProgress(stepValue);
  }

  onSlideEnd(slide: SlideData) {
    let z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
    const currentStepValue = (slide.distance / z);
    const velocity = slide.velocity;
    z = Math.abs(z * 0.5);
    const shouldCompleteRight = (velocity >= 0)
      && (velocity > 0.2 || slide.delta > z);

    const shouldCompleteLeft = (velocity <= 0)
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

    this.menu._swipeEnd(shouldCompleteLeft, shouldCompleteRight, currentStepValue, velocity);
  }

  getElementStartPos(slide: SlideData) {
    const menu = this.menu;
    if (menu.isRightSide !== this.plt.isRTL) {
      return menu.isOpen ? slide.min : slide.max;
    }
    // left menu
    return menu.isOpen ? slide.max : slide.min;
  }

  getSlideBoundaries(): { min: number, max: number } {
    const menu = this.menu;
    if (menu.isRightSide !== this.plt.isRTL) {
      return {
        min: -menu.width(),
        max: 0
      };
    }
    // left menu
    return {
      min: 0,
      max: menu.width()
    };
  }
}
