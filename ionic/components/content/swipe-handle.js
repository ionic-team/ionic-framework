import {ElementRef} from 'angular2/angular2'
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Directive} from 'angular2/src/core/annotations_impl/annotations';

import {Gesture} from 'ionic/gestures/gesture';
import {NavItem} from '../nav/nav-item';


@Directive({
  selector: 'swipe-handle'
})
export class SwipeHandle {
  constructor(@Ancestor() navItem: NavItem, elementRef: ElementRef) {
    let nav = navItem.nav;

    let gesture = new Gesture(elementRef.domElement);

    gesture.listen();

    gesture.on('panend', onDragEnd);
    gesture.on('panleft', onDragHorizontal);
    gesture.on('panright', onDragHorizontal);

    let navWidth = 0;

    function onDragEnd(ev) {
      // TODO: POLISH THESE NUMBERS WITH GOOD MATHIFICATION

      let progress = ev.gesture.center.x / navWidth;
      let completeSwipeBack = (progress > 0.5);
      let playbackRate = 4;

      if (completeSwipeBack) {
        // complete swipe back
        if (progress > 0.7) {
          playbackRate = 3;
        } else if (progress > 0.8) {
          playbackRate = 2;
        } else if (progress > 0.9) {
          playbackRate = 1;
        }

      } else {
        // cancel swipe back
        if (progress < 0.3) {
          playbackRate = 3;
        } else if (progress < 0.2) {
          playbackRate = 2;
        } else if (progress < 0.1) {
          playbackRate = 1;
        }
      }

      nav.swipeBackEnd(completeSwipeBack, progress, playbackRate);
      navWidth = 0;
    }

    function onDragHorizontal(ev) {
      if (navWidth === 0) {
        navWidth = nav.width();
        nav.swipeBackStart();
      }

      nav.swipeBackProgress( ev.gesture.center.x / navWidth );
    }

  }

}
