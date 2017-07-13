import { App } from '../app/app';
import { Config } from '../../config/config';
import { isPresent } from '../../util/util';
import { NavOptions } from '../../navigation/nav-util';
import { PORTAL_TOAST } from '../app/app-constants';
import { ToastCmp } from './toast-component';
import { ToastOptions } from './toast-options';
import { ToastMdSlideIn, ToastMdSlideOut, ToastSlideIn, ToastSlideOut, ToastWpPopIn, ToastWpPopOut } from './toast-transitions';
import { ViewController } from '../../navigation/view-controller';


/**
 * @hidden
 */
export class Toast extends ViewController {
  private _app: App;

  constructor(app: App, opts: ToastOptions = {}, config: Config) {
    opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;
    super(ToastCmp, opts, null);
    this._app = app;

    // set the position to the bottom if not provided
    if (!opts.position || !this.isValidPosition(opts.position)) {
      opts.position = TOAST_POSITION_BOTTOM;
    }

    this.isOverlay = true;

    config.setTransition('toast-slide-in', ToastSlideIn);
    config.setTransition('toast-slide-out', ToastSlideOut);
    config.setTransition('toast-md-slide-in', ToastMdSlideIn);
    config.setTransition('toast-md-slide-out', ToastMdSlideOut);
    config.setTransition('toast-wp-slide-out', ToastWpPopOut);
    config.setTransition('toast-wp-slide-in', ToastWpPopIn);
  }

  /**
  * @hidden
  */
  getTransitionName(direction: string): string {
    let key = 'toast' + (direction === 'back' ? 'Leave' : 'Enter');
    return this._nav && this._nav.config.get(key);
  }

  /**
  * @hidden
  */
  isValidPosition(position: string): boolean {
    return position === TOAST_POSITION_TOP || position === TOAST_POSITION_MIDDLE || position === TOAST_POSITION_BOTTOM;
  }

  /**
   * @param {string} message  Toast message content
   */
  setMessage(message: string): Toast {
    this.data.message = message;
    return this;
  }

  /**
   * @param {number} dur  Toast message duration
   */
  setDuration(dur: number): Toast {
    this.data.duration = dur;
    return this;
  }

  /**
   * @param {'top'|'middle'|'bottom'} pos  Toast message position
   */
  setPosition(pos: 'top' | 'middle' | 'bottom'): Toast {
    this.data.position = pos;
    return this;
  }

  /**
   * @param {string} cssClass  Toast message CSS class
   */
  setCssClass(cssClass: string): Toast {
    this.data.cssClass = cssClass;
    return this;
  }

  /**
   * @param {boolean} closeButton  Toast message close button
   */
  setShowCloseButton(closeButton: boolean): Toast {
    this.data.showCloseButton = closeButton;
    return this;
  }

  /**
   * Present the toast instance.
   *
   * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}): Promise<any> {
    navOptions.disableApp = false;
    navOptions.keyboardClose = false;
    return this._app.present(this, navOptions, PORTAL_TOAST);
  }

  /**
   * Dismiss all toast components which have been presented.
   */
  dismissAll() {
    this._nav && this._nav.popAll();
  }

}

const TOAST_POSITION_TOP = 'top';
const TOAST_POSITION_MIDDLE = 'middle';
const TOAST_POSITION_BOTTOM = 'bottom';
