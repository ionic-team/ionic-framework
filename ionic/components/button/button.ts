import {Directive, ElementRef, Optional, Host, onDestroy, NgZone, Query, QueryList} from 'angular2/angular2';

import {Icon} from '../icon/icon';
import {IonicConfig} from '../../config/config';
import {Activator} from '../../util/activator';
import * as dom  from '../../util/dom';

/**
 * TODO
 */
@Directive({
  selector: 'button,[button]',
  host: {
    '[class.icon-left]': 'iconLeft',
    '[class.icon-right]': 'iconRight',
    '[class.icon-only]': 'iconOnly'
  }
})
export class Button {
  /**
   * TODO
   */
  constructor() {
    this.iconLeft = this.iconRight = this.iconOnly = false;
  }

  /**
   * TODO
   * @param {TODO} icon  TODO
   */
  registerIcon(icon) {
    this.iconLeft = icon.iconLeft;
    this.iconRight = icon.iconRight;
    this.iconOnly = icon.iconOnly;
  }
}

/**
 * TODO
 */
@Directive({
  selector: '[tap-disabled]'
})
export class TapDisabled {}

/**
 * TODO
 */
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
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   * @param {NgZone} ngZone  TODO
   * @param {TapDisabled=} tapDisabled  TODO
   */
  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    ngZone: NgZone,
    @Optional() @Host() tapDisabled: TapDisabled
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

  /**
   * TODO
   * @param {TODO} ev  TODO
   */
  touchStart(ev) {
    this.pointerStart(ev);
  }

  /**
   * TODO
   * @param {TODO} ev  TODO
   */
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

  /**
   * TODO
   * @param {TODO} ev  TODO
   */
  mouseDown(ev) {
    if (this.disableClick) {
      ev.preventDefault();
      ev.stopPropagation();

    } else {
      this.pointerStart(ev);
    }
  }

  /**
   * TODO
   * @param {TODO} ev  TODO
   */
  mouseUp(ev) {
    if (this.disableClick) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    this.pointerEnd();
  }

  /**
   * TODO
   * @param {TODO} ev  TODO
   */
  pointerStart(ev) {
    this.start = dom.pointerCoord(ev);

    this.zone.runOutsideAngular(() => {
      Activator.start(ev.currentTarget);
      Activator.moveListeners(this.pointerMove, true);
    });
  }

  /**
   * TODO
   */
  pointerEnd() {
    this.zone.runOutsideAngular(() => {
      Activator.end();
      Activator.moveListeners(this.pointerMove, false);
    });
  }

  /**
   * TODO
   */
  pointerCancel() {
    this.start = null;

    this.zone.runOutsideAngular(() => {
      Activator.clear();
      Activator.moveListeners(this.pointerMove, false);
    });
  }

  /**
   * Whether the supplied click event should be allowed or not.
   * @param {MouseEvent} ev  The click event.
   * @return {boolean} True if click event should be allowed, otherwise false.
   */
  allowClick(ev) {
    if (!ev.isIonicTap) {
      if (this.disableClick || !this.start) {
        return false;
      }
    }
    return true;
  }

  /**
   * TODO
   * @param {MouseEvent} ev  TODO
   */
  click(ev) {
    if (!this.allowClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  /**
   * TODO
   */
  onDestroy() {
    this.ele = null;
  }

}
