import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
 * Manage the native keyboard. Note: this plugin performs mainly in the native
 * app context. Most operations are non-functional in a normal web browser as
 * keyboard control is limited.
 *
 * @usage
 * ```js
 * // Hide the accessory bar
 * Keyboard.setAccessoryBarVisible(false)
 *
 * Keyboard.close()
 * ```
 */
@NativePlugin({
  name: 'Keyboard',
  platforms: ['ios', 'android'],
  engines: {
    cordova: 'ionic-plugin-keyboard'
  },
  pluginCheck: () => {
    return window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard;
  }
})
export class Keyboard {
  /**
   * Set whether the accessory bar is visible.
   *
   * Note: this only works while running natively (accessory bar cannot be removed
   * in most web browsers), and by default the bar is hidden when running natively.
   *
   * @param isVisible whether the accessory bar is visible
   */
  static setAccessoryBarVisible(isVisible) {
    this.ifPlugin(() => {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!isVisible);
    })
  }

  /**
   * Close the keyboard.
   */
  static close() {
    this.ifPlugin(() => {
      cordova.plugins.Keyboard.close();
    })
  }

  /**
   * Show the keyboard. Does nothing on iOS (has to be triggered from an input)
   */
  static show() {
    this.ifPlugin(() => {
      cordova.plugins.Keyboard.show();
    })
  }

  /**
   * @return the visibility of the keyboard.
   */
  static isVisible() {
    return this.ifPlugin(() => {
      return cordova.plugins.Keyboard.isVisible;
    });
  }
}
