import { Injectable } from '@angular/core';

import { App } from '../app/app';
import { AppPortal } from '../app/app-root';
import { isPresent } from '../../util/util';
import { NavOptions } from '../../navigation/nav-util';
import { ToastOptions } from './toast-options';
import { ToastCmp } from './toast-component';
import { ViewController } from '../../navigation/view-controller';

/**
 * @name Toast
 * @description
 * A Toast is a subtle notification commonly used in modern applications.
 * It can be used to provide feedback about an operation or to
 * display a system message. The toast appears on top of the app's content,
 * and can be dismissed by the app to resume user interaction with
 * the app.
 *
 * Instances of the Toast component are created by calling the `create()` function
 * of the [ToastController class](../ToastController). The Toast is displayed
 * to the user by calling `present()` on the Toast instance.
 * 
 * @usage
 * For a complete usage example, see the [ToastController API docs](../ToastController). 
 *
 * @demo /docs/v2/demos/src/toast/basic 
 * @see {@link /docs/v2/components#toast Toast Component Docs}
 * @see {@link ../ToastController/ ToastController API Docs} 
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
   * Set the message for the instance of Toast
   *
   * @param {string} message  Toast message content
   */
  setMessage(message: string) {
    this.data.message = message;
  }

  /**
   * Present the Toast instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    navOptions.disableApp = false;
    return this._app.present(this, navOptions, AppPortal.TOAST);
  }

  /**
   * Dismiss all Toast components which have been presented.
   */
  dismissAll() {
    this._nav && this._nav.popAll();
  }

}


/**
 * @name ToastController
 * @description
 * The ToastController class is used to create instances of the Toast component.
 *
 * ### Creating
 * All of the toast options should be passed in the first argument of
 * the create method: `create(opts)`. The message to display should be
 * passed in the `message` property. The `showCloseButton` option can be set to
 * true in order to display a close button on the toast. See the [create](#create)
 * method below for all available options.
 *
 * ### Positioning
 * Toasts can be positioned at the top, bottom or middle of the
 * view port. The position can be passed to the `Toast.create(opts)` method.
 * The position option is a string, and the values accepted are `top`, `bottom` and `middle`.
 * If the position is not specified, the toast will be displayed at the bottom of the view port.
 *
 * ### Dismissing
 * The toast can be dismissed automatically after a specific amount of time
 * by passing the number of milliseconds to display it in the `duration` of
 * the toast options. If `showCloseButton` is set to true, then the close button
 * will dismiss the toast. To dismiss the toast after creation, call the `dismiss()`
 * method on the Toast instance. The `onDidDismiss` function can be called to perform an action after the toast
 * is dismissed.
 *
 * @usage
 * ```ts
 * constructor(private toastCtrl: ToastController) {
 *
 * }
 *
 * presentToast() {
 *   let toast = this.toastCtrl.create({
 *     message: 'User was added successfully',
 *     duration: 3000,
 *     position: 'top'
 *   });
 *
 *   toast.onDidDismiss(() => {
 *     console.log('Dismissed toast');
 *   });
 *
 *   toast.present();
 * }
 * ```
 * ## Toast Options
 * | Property              | Type      | Default         | Description                                                                                                   |
 * |-----------------------|-----------|-----------------|---------------------------------------------------------------------------------------------------------------|
 * | message               | `string`  | -               | The message for the toast. Long strings will wrap and the toast container will expand.                        |
 * | duration              | `number`  | -               | How many milliseconds to wait before hiding the toast. By default, it will show until `dismiss()` is called.  |
 * | position              | `string`  | "bottom"        | The position of the toast on the screen. Accepted values: "top", "middle", "bottom".                          |
 * | cssClass              | `string`  | -               | Additional classes for custom styles, separated by spaces.                                                    |
 * | showCloseButton       | `boolean` | false           | Whether or not to show a button to close the toast.                                                           |
 * | closeButtonText       | `string`  | "Close"         | Text to display in the close button.                                                                          |
 * | dismissOnPageChange   | `boolean` | false           | Whether to dismiss the toast when navigating to a new page.                                                   |
 *
 * @demo /docs/v2/demos/src/toast/basic
 * @see {@link /docs/v2/components#toast Toast Component Docs}
 * @see {@link ../Toast/ Toast API Docs} 
 */
@Injectable()
export class ToastController {

  constructor(private _app: App) {}

  /**
   * Create a new instance of the Toast component.
   * @param {ToastOptions} opts See [Toast Options](#toast-options).
   */
  create(opts: ToastOptions = {}) {
    return new Toast(this._app, opts);
  }

}

const TOAST_POSITION_TOP = 'top';
const TOAST_POSITION_MIDDLE = 'middle';
const TOAST_POSITION_BOTTOM = 'bottom';
