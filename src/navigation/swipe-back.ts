import { assign, swipeShouldReset } from '../util/util';
import { GestureController, GesturePriority, DisableScroll } from '../gestures/gesture-controller';
import { NavControllerBase } from './nav-controller-base';
import { SlideData } from '../gestures/slide-gesture';
import { SlideEdgeGesture } from '../gestures/slide-edge-gesture';
import { NativeRafDebouncer } from '../util/debouncer';

export class SwipeBackGesture extends SlideEdgeGesture {
  constructor(
    private _nav: NavControllerBase,
    element: HTMLElement,
    gestureCtlr: GestureController,
    options: any,
  ) {
    super(element, assign({
      direction: 'x',
      maxEdgeStart: 75,
      zone: false,
      threshold: 0,
      maxAngle: 40,
      debouncer: new NativeRafDebouncer(),
      gesture: gestureCtlr.create('goback-swipe', {
        priority: GesturePriority.GoBackSwipe,
        disableScroll: DisableScroll.DuringCapture
      })
    }, options));
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

  onSlideBeforeStart(ev: any) {
    this._nav.swipeBackStart();
  }

  onSlide(slide: SlideData, ev: any) {
    ev.preventDefault();
    ev.stopPropagation();

    let stepValue = (slide.distance / slide.max);
    this._nav.swipeBackProgress(stepValue);
  }

  onSlideEnd(slide: SlideData, ev: any) {
    const currentStepValue = (slide.distance / slide.max);
    const isResetDirecction = slide.velocity < 0;
    const isMovingFast = Math.abs(slide.velocity) > 0.4;
    const isInResetZone = Math.abs(slide.delta) < Math.abs(slide.max) * 0.5;
    const shouldComplete = !swipeShouldReset(isResetDirecction, isMovingFast, isInResetZone);

    this._nav.swipeBackEnd(shouldComplete, currentStepValue);
  }
}
