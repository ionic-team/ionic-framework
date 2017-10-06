import { ChangeDetectionStrategy, Component, ElementRef, Input, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';

/**
 * @name Spinner
 * @description
 * The `ion-spinner` component provides a variety of animated SVG spinners.
 * Spinners enables you to give users feedback that the app is actively
 * processing/thinking/waiting/chillin’ out, or whatever you’d like it to indicate.
 * By default, the `ion-refresher` feature uses this spinner component while it's
 * the refresher is in the `refreshing` state.
 *
 * Ionic offers a handful of spinners out of the box, and by default, it will use
 * the appropriate spinner for the platform on which it’s running.
 *
 * <table class="table spinner-table">
 *  <tr>
 *    <th>
 *      <code>ios</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="ios"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>ios-small</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="ios-small"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>bubbles</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="bubbles"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>circles</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="circles"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>crescent</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="crescent"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>dots</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="dots"></ion-spinner>
 *    </td>
 *  </tr>
 * </table>
 *
 * @usage
 * The following code would use the default spinner for the platform it's
 * running from. If it's neither iOS or Android, it'll default to use `ios`.
 *
 * ```html
 * <ion-spinner></ion-spinner>
 * ```
 *
 * By setting the `name` property, you can specify which predefined spinner to
 * use, no matter what the platform is.
 *
 * ```html
 * <ion-spinner name="bubbles"></ion-spinner>
 * ```
 *
 * ## Styling SVG with CSS
 * One cool thing about SVG is its ability to be styled with CSS! One thing to note
 * is that some of the CSS properties on an SVG element have different names. For
 * example, SVG uses the term `stroke` instead of `border`, and `fill` instead
 * of `background-color`.
 *
 * ```css
 * ion-spinner * {
 *   width: 28px;
 *   height: 28px;
 *   stroke: #444;
 *   fill: #222;
 * }
 * ```
 */
@Component({
  selector: 'ion-spinner',
  template:
    '<svg viewBox="0 0 64 64" *ngFor="let i of _c" [ngStyle]="i.style">' +
      '<circle [attr.r]="i.r" transform="translate(32,32)"></circle>' +
    '</svg>' +
    '<svg viewBox="0 0 64 64" *ngFor="let i of _l" [ngStyle]="i.style">' +
      '<line [attr.y1]="i.y1" [attr.y2]="i.y2" transform="translate(32,32)"></line>' +
    '</svg>',
  host: {
    '[class.spinner-paused]': '_paused'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Spinner extends Ion {

  _c: any[];
  _l: any[];
  _name: string;
  _dur: number = null;
  _init: boolean;
  _paused: boolean = false;

  /**
   * @input {string} SVG spinner name.
   */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(val: string) {
    this._name = val;
    this.load();
  }

  /**
   * @input {string} How long it takes it to do one loop.
   */
  @Input()
  get duration(): number {
    return this._dur;
  }
  set duration(val: number) {
    this._dur = val;
    this.load();
  }

  /**
   * @input {boolean} If true, pause the animation.
   */
  @Input()
  get paused(): boolean {
    return this._paused;
  }
  set paused(val: boolean) {
    this._paused = isTrueProperty(val);
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'spinner');
  }

  /**
   * @hidden
   */
  ngOnInit() {
    this._init = true;
    this.load();
  }

  /**
   * @hidden
   */
  load() {
    if (this._init) {
      this._l = [];
      this._c = [];

      var name = this._name || this._config.get('spinner', 'ios');

      const spinner = SPINNERS[name];
      if (spinner) {
        if (spinner.lines) {
          for (let i = 0, l = spinner.lines; i < l; i++) {
            this._l.push(this._loadEle(spinner, i, l));
          }

        } else if (spinner.circles) {
          for (let i = 0, l = spinner.circles; i < l; i++) {
            this._c.push(this._loadEle(spinner, i, l));
          }
        }

        this.setElementClass(`spinner-${name}`, true);
        this.setElementClass(`spinner-${this._mode}-${name}`, true);
      }
    }
  }

  _loadEle(spinner: any, index: number, total: number) {
    let duration = this._dur || spinner.dur;
    let data = spinner.fn(duration, index, total);
    data.style.animationDuration = duration + 'ms';
    return data;
  }

}

const SPINNERS: any = {

  ios: {
    dur: 1000,
    lines: 12,
    fn: function (dur: number, index: number, total: number) {
      const transform = 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)';
      const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        y1: 17,
        y2: 29,
        style: {
          transform: transform,
          webkitTransform: transform,
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },

  'ios-small': {
    dur: 1000,
    lines: 12,
    fn: function (dur: number, index: number, total: number) {
      const transform = 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)';
      const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        y1: 12,
        y2: 20,
        style: {
          transform: transform,
          webkitTransform: transform,
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },

  bubbles: {
    dur: 1000,
    circles: 9,
    fn: function (dur: number, index: number, total: number) {
      const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        r: 5,
        style: {
          top: (9 * Math.sin(2 * Math.PI * index / total)) + 'px',
          left: (9 * Math.cos(2 * Math.PI * index / total)) + 'px',
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },

  circles: {
    dur: 1000,
    circles: 8,
    fn: function (dur: number, index: number, total: number) {
      const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        r: 5,
        style: {
          top: (9 * Math.sin(2 * Math.PI * index / total)) + 'px',
          left: (9 * Math.cos(2 * Math.PI * index / total)) + 'px',
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },

  crescent: {
    dur: 750,
    circles: 1,
    fn: function () {
      return {
        r: 26,
        style: {}
      };
    }
  },

  dots: {
    dur: 750,
    circles: 3,
    fn: function (_dur: number, index: number) {
      const animationDelay = -(110 * index) + 'ms';
      return {
        r: 6,
        style: {
          left: (9 - (9 * index)) + 'px',
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  }

};
