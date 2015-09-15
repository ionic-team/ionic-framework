import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
 * A native dialogs system. Native dialogs can give you a bit more
 * control over the UI than the browser built-ins, though the Dialogs
 * plugin will fall back to the built-ins when necessary.
 */
@NativePlugin({
  name: 'Dialogs',
  platforms: ['ios', 'android', 'web'],
  engines: {
    cordova: 'cordova-plugin-dialogs'
  }
})
export class Dialogs {
  /**
   * Trigger an alert prompt.
   *
   * @param message the message to show
   * @param title the title to show
   * @param buttonName the button label to use (not available on browser fallback)
   * @return Promise
   */
  static alert(message, title, buttonName) {
    return new Promise((resolve,reject) => {
      if(!navigator.notification) {
        this.pluginWarn();
        alert(message);
        resolve();
      } else {
        navigator.notification.alert(message, () => {
          resolve();
        }, title, buttonName);
      }
    });
  }

  /**
   * Trigger a confirm prompt.
   *
   * @param message the message to show
   * @param title the title to show
   * @param buttonLabels the button labels to use (not available on browser fallback)
   * @return Promise that resolves with the index of the button selected (zero indexed). 1 is OK on browser fallback
   */
  static confirm(message, title, buttonLabels) {
    return new Promise((resolve,reject) => {
      if(!navigator.notification) {
        this.pluginWarn();
        var ok = confirm(message);
        // Use 2 as OK
        resolve(ok ? 2 : 0);
      } else {
        navigator.notification.confirm(message, (buttonIndex) => {
          resolve(buttonIndex - 1);
        }, title, buttonLabels);
      }
    });
  }

  static prompt(message, title, buttonLabels, defaultText) {
    return new Promise((resolve,reject) => {
      if(!navigator.notification) {
        this.pluginWarn();
        var response = prompt(message);
        // Use 1 as OK
        resolve(response);
      } else {
        navigator.notification.prompt(message, (results) => {
          resolve(results.input1, buttonIndex - 1);
        }, title, buttonLabels, defaultText);
      }
    });
  }

  /**
   * Beep n times. Not available on browser.
   * @param times the number of times to beep
   */
  static beep(times) {
    navigator.notification && navigator.notification.beep(times);
  }
}
