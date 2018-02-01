import { swipeShouldReset } from '../util/util';
import { DomController } from '../platform/dom-controller';
import { GESTURE_GO_BACK_SWIPE, GESTURE_PRIORITY_GO_BACK_SWIPE, GestureController } from '../gestures/gesture-controller';
import { NavControllerBase } from './nav-controller-base';
import { Platform } from '../platform/platform';
import { SlideData } from '../gestures/slide-gesture';
import { SlideEdgeGesture } from '../gestures/slide-edge-gesture';

/**
 * @hidden
 */
export class SwipeBackGesture extends SlideEdgeGesture {

  constructor(
    plt: Platform,
    private _nav: NavControllerBase,
    gestureCtlr: GestureController,
    domCtrl: DomController,
  ) {
    super(plt, plt.doc().body, {
      direction: 'x',
      edge: 'start',
      maxEdgeStart: 75,
      threshold: 5,
      zone: false,
      domController: domCtrl,
      gesture: gestureCtlr.createGesture({
        name: GESTURE_GO_BACK_SWIPE,
        priority: GESTURE_PRIORITY_GO_BACK_SWIPE,
        disableScroll: true
      })
    });
  }

  canStart(ev: any): boolean {
    // the gesture swipe angle must be mainly horizontal and the
    // gesture distance would be relatively short for a swipe back
    // and swipe back must be possible on this nav controller
    return (
      this._nav.canSwipeBack() &&
      super.canStart(ev)
    );
  }

  onSlideBeforeStart(_ev: any) {
    this._nav.swipeBackStart();
  }

  onSlide(slide: SlideData, ev: any) {
    ev.preventDefault();
    ev.stopPropagation();

    const stepValue = (slide.distance / slide.max);
    this._nav.swipeBackProgress(stepValue);
  }

  onSlideEnd(slide: SlideData, _ev: any) {
    const velocity = slide.velocity;
    const currentStepValue = (slide.distance / slide.max);
    const isResetDirecction = velocity < 0;
    const isMovingFast = Math.abs(slide.velocity) > 0.4;
    const isInResetZone = Math.abs(slide.delta) < Math.abs(slide.max) * 0.5;
    const shouldComplete = !swipeShouldReset(isResetDirecction, isMovingFast, isInResetZone);

    this._nav.swipeBackEnd(shouldComplete, currentStepValue, velocity);
  }
}
