import {ElementRef} from 'angular2/angular2'
import {Directive} from 'angular2/src/core/annotations_impl/annotations';
import {Optional} from 'angular2/src/di/annotations_impl';

import {ViewController} from '../view/view-controller';
import {Gesture} from 'ionic/gestures/gesture';


@Directive({
  selector: '.swipe-handle',
  hostProperties: {
    'showHandle()': 'class.show-handle'
  }
})
export class SwipeHandle {
  constructor(
    @Optional() viewCtrl: ViewController,
    elementRef: ElementRef
  ) {
    if (!viewCtrl) return;

    this.viewCtrl = viewCtrl;

    let gesture = new Gesture(elementRef.domElement);
    gesture.listen();

    gesture.on('panend', onDragEnd);
    gesture.on('panleft', onDragHorizontal);
    gesture.on('panright', onDragHorizontal);

    let startX = null;
    let swipeableAreaWidth = null;

    function onDragEnd(ev) {
      ev.preventDefault();
      ev.stopPropagation();

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

      viewCtrl.swipeBackEnd(completeSwipeBack, progress, playbackRate);

      startX = null;
    }

    function onDragHorizontal(ev) {
      if (startX === null) {
        ev.preventDefault();
        ev.stopPropagation();

        startX = ev.gesture.center.x;
        swipeableAreaWidth = viewCtrl.width() - startX;

        viewCtrl.swipeBackStart();
      }

      viewCtrl.swipeBackProgress( (ev.gesture.center.x - startX) / swipeableAreaWidth );
    }

  }

  showHandle() {
    return (this.viewCtrl ? this.viewCtrl.swipeBackEnabled() : false);
  }

}
