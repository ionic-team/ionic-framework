import { App } from '../app/app';
import { AppPortal } from '../app/app-root';
import { isPresent } from '../../util/util';
import { NavOptions } from '../../navigation/nav-util';
import { ToastOptions } from './toast-options';
import { ToastCmp } from './toast-component';
import { ViewController } from '../../navigation/view-controller';


/**
 * @private
 */
export class Toast extends ViewController {
  private _app: App;

  constructor(app: App, opts: ToastOptions = {}) {
    opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;
    super(ToastCmp, opts, null);
    this._app = app;

    // set the position to the bottom if not provided
    if (!opts.position || !this.isValidPosition(opts.position)) {
      opts.position = TOAST_POSITION_BOTTOM;
    }

    this.isOverlay = true;
  }

  /**
  * @private
  */
  getTransitionName(direction: string) {
    let key = 'toast' + (direction === 'back' ? 'Leave' : 'Enter');
    return this._nav && this._nav.config.get(key);
  }

  /**
  * @private
  */
  isValidPosition(position: string) {
    return position === TOAST_POSITION_TOP || position === TOAST_POSITION_MIDDLE || position === TOAST_POSITION_BOTTOM;
  }

  /**
   * @param {string} message  Toast message content
   */
  setMessage(message: string) {
    this.data.message = message;
  }

  /**
   * Present the toast instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    navOptions.disableApp = false;
    return this._app.present(this, navOptions, AppPortal.TOAST);
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
