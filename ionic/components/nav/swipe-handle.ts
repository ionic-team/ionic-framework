import {ElementRef, Directive, Host, Optional, Inject, forwardRef, NgZone} from 'angular2/angular2';

import {ViewController} from '../view/view-controller';
import {Pane} from './pane';
import {Gesture} from 'ionic/gestures/gesture';


/**
 * TODO
 */
@Directive({
  selector: '.swipe-handle',
  host: {
    '[class.show-handle]': 'showHandle'
  }
})
export class SwipeHandle {
  /**
   * TODO
   * @param {ViewController=} viewCtrl  TODO
   * @param {Pane} pane  TODO
   * @param {ElementRef} elementRef  TODO
   * @param {NgZone} ngZone  TODO
   */
  constructor(
    @Optional() @Inject(forwardRef(() => ViewController)) viewCtrl: ViewController,
    @Host() @Inject(forwardRef(() => Pane)) pane: Pane,
    elementRef: ElementRef,
    ngZone: NgZone
  ) {

    if (!viewCtrl || !viewCtrl.isSwipeBackEnabled() || !pane) return;

    const self = this;

    self.pane = pane;
    self.viewCtrl = viewCtrl;
    self.zone = ngZone;

    this.zone.runOutsideAngular(() => {
      let gesture = self.gesture = new Gesture(elementRef.nativeElement);
      gesture.listen();

      function dragHorizontal(ev) {
        self.onDragHorizontal(ev);
      }

      gesture.on('panend', gestureEv => { self.onDragEnd(gestureEv.gesture); });
      gesture.on('panleft', dragHorizontal);
      gesture.on('panright', dragHorizontal);
    });

    self.startX = null;
    self.width = null;
  }

  onDragEnd(gesture) {
    gesture.srcEvent.preventDefault();
    gesture.srcEvent.stopPropagation();

    // TODO: POLISH THESE NUMBERS WITH GOOD MATHIFICATION
    let progress = (gesture.center.x - this.startX) / this.width;
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

    this.zone.run(() => {
      this.viewCtrl.swipeBackEnd(completeSwipeBack, progress, playbackRate);
    });

    this.startX = null;
  }

  onDragHorizontal(gestureEv) {
    this.zone.run(() => {
      let gesture = gestureEv.gesture;

      if (this.startX === null) {
        // starting drag
        gesture.srcEvent.preventDefault();
        gesture.srcEvent.stopPropagation();

        this.startX = gesture.center.x;
        this.width = this.pane.width() - this.startX;

        this.viewCtrl.swipeBackStart();
      }

      this.viewCtrl.swipeBackProgress( (gesture.center.x - this.startX) / this.width );
    });
  }

  get showHandle() {
    return (this.viewCtrl ? this.viewCtrl.canSwipeBack() : false);
  }

  onDestroy() {
    this.gesture && this.gesture.destroy();
  }

}
