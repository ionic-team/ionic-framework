import {Directive, ElementRef, Optional, Ancestor, onDestroy, NgZone, Query, QueryList} from 'angular2/angular2';

import {Icon} from '../icon/icon';
import {IonicConfig} from '../../config/config';
import {Activator} from '../../util/activator';
import * as dom  from '../../util/dom';


@Directive({
  selector: 'button,[button]',
  host: {
    '[class.icon-left]': 'iconLeft',
    '[class.icon-right]': 'iconRight',
    '[class.icon-only]': 'iconOnly'
  }
})
export class Button {
  constructor() {
    this.iconLeft = this.iconRight = this.iconOnly = false;
  }

  registerIcon(icon) {
    this.iconLeft = icon.iconLeft;
    this.iconRight = icon.iconRight;
    this.iconOnly = icon.iconOnly;
  }
}


@Directive({
  selector: '[tap-disabled]'
})
export class TapDisabled {}


@Directive({
  selector: 'button,[button],[tappable],ion-checkbox,ion-radio',
  host: {
    '(^touchstart)': 'touchStart($event)',
    '(^touchend)': 'touchEnd($event)',
    '(^touchcancel)': 'pointerCancel()',
    '(^mousedown)': 'mouseDown($event)',
    '(^mouseup)': 'mouseUp($event)',
    '(^click)': 'click($event)',
  }
})
export class TapClick {

  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    ngZone: NgZone,
    @Optional() @Ancestor() tapDisabled: TapDisabled
  ) {
    this.ele = elementRef.nativeElement;
    this.tapEnabled = !tapDisabled;
    this.tapPolyfill = config.setting('tapPolyfill');
    this.zone = ngZone;

    let self = this;
    self.pointerMove = function(ev) {
      let moveCoord = dom.pointerCoord(ev);
      console.log('pointerMove', moveCoord, self.start)

      if ( dom.hasPointerMoved(10, self.start, moveCoord) ) {
        self.pointerCancel();
      }
    };
  }

  touchStart(ev) {
    this.pointerStart(ev);
  }

  touchEnd(ev) {
    let self = this;

    if (this.tapPolyfill && this.tapEnabled) {

      let endCoord = dom.pointerCoord(ev);

      this.disableClick = true;
      this.zone.runOutsideAngular(() => {
        clearTimeout(self.disableTimer);
        self.disableTimer = setTimeout(() => {
          self.disableClick = false;
        }, 600);
      });

      if ( this.start && !dom.hasPointerMoved(3, this.start, endCoord) ) {
        let clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0, endCoord.x, endCoord.y, false, false, false, false, 0, null);
        clickEvent.isIonicTap = true;
        this.ele.dispatchEvent(clickEvent);
      }

    }

    this.pointerEnd();
  }

  mouseDown(ev) {
    if (this.disableClick) {
      ev.preventDefault();
      ev.stopPropagation();

    } else {
      this.pointerStart(ev);
    }
  }

  mouseUp(ev) {
    if (this.disableClick) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    this.pointerEnd();
  }

  pointerStart(ev) {
    this.start = dom.pointerCoord(ev);

    this.zone.runOutsideAngular(() => {
      Activator.start(ev.currentTarget);
      Activator.moveListeners(this.pointerMove, true);
    });
  }

  pointerEnd() {
    this.zone.runOutsideAngular(() => {
      Activator.end();
      Activator.moveListeners(this.pointerMove, false);
    });
  }

  pointerCancel() {
    this.start = null;

    this.zone.runOutsideAngular(() => {
      Activator.clear();
      Activator.moveListeners(this.pointerMove, false);
    });
  }

  allowClick(ev) {
    if (!ev.isIonicTap) {
      if (this.disableClick || !this.start) {
        return false;
      }
    }
    return true;
  }

  click(ev) {
    if (!this.allowClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  onDestroy() {
    this.ele = null;
  }

}
