import {NavController} from './nav-controller';
import {SlideEdgeGesture} from '../../gestures/slide-edge-gesture';
import {SlideData} from '../../gestures/slide-gesture';
import {assign} from '../../util/util';


export class SwipeBackGesture extends SlideEdgeGesture {

  constructor(
    element: HTMLElement,
    options: any,
    private _nav: NavController
  ) {
    super(element, assign({
      direction: 'x',
      maxEdgeStart: 75
    }, options));
  }

  canStart(ev: any) {
    // the gesture swipe angle must be mainly horizontal and the
    // gesture distance would be relatively short for a swipe back
    // and swipe back must be possible on this nav controller
    if (ev.angle > -40 &&
        ev.angle < 40 &&
        ev.distance < 50 &&
        this._nav.canSwipeBack()) {
	    // passed the tests, now see if the super says it's cool or not
      return super.canStart(ev);
    }

    // nerp, not today
    return false;
  }

  onSlideBeforeStart() {
    console.debug('swipeBack, onSlideBeforeStart');
    this._nav.swipeBackStart();
  }

  onSlide(slide: SlideData) {
    let stepValue = (slide.distance / slide.max);
    console.debug('swipeBack, onSlide, distance', slide.distance, 'max', slide.max, 'stepValue', stepValue);
    this._nav.swipeBackProgress(stepValue);
  }

  onSlideEnd(slide: SlideData, ev: any) {
    let shouldComplete = (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5);

    let currentStepValue = (slide.distance / slide.max);

    console.debug('swipeBack, onSlideEnd, shouldComplete', shouldComplete, 'currentStepValue', currentStepValue);

    this._nav.swipeBackEnd(shouldComplete, currentStepValue);
  }

}
