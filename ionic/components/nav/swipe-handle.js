import {ElementRef} from 'angular2/angular2'
import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Directive} from 'angular2/src/core/annotations_impl/annotations';

import {Gesture} from 'ionic/gestures/gesture';
import {Nav} from './nav';


@Directive({
  selector: 'swipe-handle'
})
export class SwipeHandle {
  constructor(@Parent() nav: Nav, elementRef: ElementRef) {
    let gesture = new Gesture(elementRef.domElement);

    gesture.listen();

    gesture.on('panend', onDragEnd);
    gesture.on('panleft', onDragHorizontal);
    gesture.on('panright', onDragHorizontal);

    let startX = null;
    let swipeableAreaWidth = null;

    function onDragEnd(ev) {
      // TODO: POLISH THESE NUMBERS WITH GOOD MATHIFICATION

      let progress = (ev.gesture.center.x - startX) / swipeableAreaWidth;
      let completeSwipeBack = (progress > 0.5);
      let playbackRate = 4;

      if (completeSwipeBack) {
        // complete swipe back
        if (progress > 0.9) {
          playbackRate = 1;
        } else if (progress > 0.8) {
          playbackRate = 2;
        } else if (progress > 0.7) {
          playbackRate = 3;
        }

      } else {
        // cancel swipe back
        if (progress < 0.1) {
          playbackRate = 1;
        } else if (progress < 0.2) {
          playbackRate = 2;
        } else if (progress < 0.3) {
          playbackRate = 3;
        }
      }

      nav.swipeBackEnd(completeSwipeBack, progress, playbackRate);

      startX = null;
    }

    function onDragHorizontal(ev) {
      if (startX === null) {
        startX = ev.gesture.center.x;
        swipeableAreaWidth = nav.width() - startX;

        nav.swipeBackStart();
      }

      nav.swipeBackProgress( (ev.gesture.center.x - startX) / swipeableAreaWidth );
    }

  }

}
