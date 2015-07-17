import {ElementRef, Directive, Parent, Optional, Inject, forwardRef} from 'angular2/angular2';

import {ViewController} from '../view/view-controller';
import {Pane} from './pane';
import {Gesture} from 'ionic/gestures/gesture';


@Directive({
  selector: '.swipe-handle',
  host: {
    '[class.show-handle]': 'showHandle'
  }
})
export class SwipeHandle {
  constructor(
    @Optional() @Inject(forwardRef(() => ViewController)) viewCtrl: ViewController,
    @Parent() @Inject(forwardRef(() => Pane)) pane: Pane,
    elementRef: ElementRef
  ) {
    if (!viewCtrl || !pane) return;

    const self = this;

    self.pane = pane;
    self.viewCtrl = viewCtrl;

    let gesture = self.gesture = new Gesture(elementRef.nativeElement);
    gesture.listen();

    function dragHorizontal(ev) {
      self.onDragHorizontal(ev);
    }

    gesture.on('panend', ev => { self.onDragEnd(ev); });
    gesture.on('panleft', dragHorizontal);
    gesture.on('panright', dragHorizontal);

    self.startX = null;
    self.width = null;
  }

  onDragEnd(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    // TODO: POLISH THESE NUMBERS WITH GOOD MATHIFICATION
    let progress = (ev.gesture.center.x - this.startX) / this.width;
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

    this.viewCtrl.swipeBackEnd(completeSwipeBack, progress, playbackRate);

    this.startX = null;
  }

  onDragHorizontal(ev) {
    if (this.startX === null) {
      // starting drag
      ev.preventDefault();
      ev.stopPropagation();

      this.startX = ev.gesture.center.x;
      this.width = this.pane.width() - this.startX;

      this.viewCtrl.swipeBackStart();
    }

    this.viewCtrl.swipeBackProgress( (ev.gesture.center.x - this.startX) / this.width );
  }

  get showHandle() {
    return (this.viewCtrl ? this.viewCtrl.swipeBackEnabled() : false);
  }

  onDestroy() {
    this.gesture && self.gesture.destroy();
  }

}
