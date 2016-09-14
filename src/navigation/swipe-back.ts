import { assign } from '../util/util';
import { GestureController, GesturePriority } from '../gestures/gesture-controller';
import { NavControllerBase } from './nav-controller-base';
import { SlideData } from '../gestures/slide-gesture';
import { SlideEdgeGesture } from '../gestures/slide-edge-gesture';


export class SwipeBackGesture extends SlideEdgeGesture {

  constructor(
    element: HTMLElement,
    options: any,
    private _nav: NavControllerBase,
    gestureCtlr: GestureController
  ) {
    super(element, assign({
      direction: 'x',
      maxEdgeStart: 75,
      gesture: gestureCtlr.create('goback-swipe', {
        priority: GesturePriority.GoBackSwipe,
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
    console.debug('swipeBack, onSlideBeforeStart', ev.type);
    this._nav.swipeBackStart();
  }

  onSlide(slide: SlideData) {
    let stepValue = (slide.distance / slide.max);
    console.debug('swipeBack, onSlide, distance', slide.distance, 'max', slide.max, 'stepValue', stepValue);
    this._nav.swipeBackProgress(stepValue);
  }

  onSlideEnd(slide: SlideData, ev: any) {
    let shouldComplete = (Math.abs(slide.velocity) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5);
    let currentStepValue = (slide.distance / slide.max);

    console.debug('swipeBack, onSlideEnd, shouldComplete', shouldComplete, 'currentStepValue', currentStepValue);
    this._nav.swipeBackEnd(shouldComplete, currentStepValue);
  }
}
