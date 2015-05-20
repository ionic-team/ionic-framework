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
      let completeSwipeBack = (ev.gesture.center.x / navWidth) > 0.5;

      nav.swipeBackEnd(completeSwipeBack);

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
