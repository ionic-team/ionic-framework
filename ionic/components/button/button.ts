import {Directive, ElementRef, Optional, Ancestor} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {Gesture} from '../../gestures/gesture';
import * as dom  from '../../util/dom';


@Directive({
  selector: '[tap-disabled]'
})
export class TapDisabled {}


@Directive({
  selector: 'a,button,[tappable]'
})
export class TapClick {

  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    @Optional() @Ancestor() tapDisabled: TapDisabled
  ) {

    if (config.setting('tapPolyfill') && !this.tapGesture && !tapDisabled) {
      this.tapGesture = new Gesture(elementRef.nativeElement);
      this.tapGesture.listen();

      this.tapGesture.on('tap', (gestureEv) => {
        this.onTap(gestureEv.gesture.srcEvent);
      });
    }

  }

  onTap(ev) {
    if (ev && this.tapGesture) {
      ev.preventDefault();
      ev.stopPropagation();

      let c = dom.pointerCoord(ev);

      let clickEvent = document.createEvent("MouseEvents");
      clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0, c.x, c.y, false, false, false, false, 0, null);
      clickEvent.isIonicTap = true;
      this.tapGesture.element.dispatchEvent(clickEvent);
    }
  }

  onDestroy() {
    this.tapGesture && this.tapGesture.destroy();
  }

}
