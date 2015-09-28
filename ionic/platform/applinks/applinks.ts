import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
 * Open installed apps on the device. Note: Android and iOS have different ways of
 * opening and specifying launch params, so they have separate launch functions.
 *
 * @usage
 *
 * ```js
 * if(platform.is('ios') {
 *   AppLinks.check('twitter://').then((installed) => {
 *     AppLinks.openIOS('twitter://user?screen_name=ionicframework')
 *   }, (err) => {
 *
 *   })
 * } else if(platform.is('android') {
 *   AppLinks.check('com.twitter.android').then((installed) => {
 *     AppLinks.openAndroid([["action", "VIEW"], ['twitter://user?screen_name=ionicframework']])
 *   })
 * }
 * ```
 */
@NativePlugin({
  name: 'AppLinks',
  platforms: ['ios', 'android'],
  engines: {
    cordova: 'cordova-plugin-statusbar'
  },
  pluginCheck: () => {
    return !!navigator.startApp;
  }
})
export class AppLinks {
  /**
   * Open app on iOS with a given URL (iOS), or scheme (Android)
   */
  static openIOS(url) {
    this.ifPlugin(() => {
      navigator.startApp.start(url)
    })
  }

  /**
   * Open app on Android with a given scheme and params.
   */
  static openAndroid(args) {
    this.ifPlugin(() => {
      navigator.startApp.start(...args);
    })
  }

  /**
   * Check if an installed app can be opened from the given URL.
   */
  static canOpen(urlOrScheme) {
    return new Promise((resolve, reject) => {
      let hasPlugin = this.ifPlugin(() => {
        navigator.startApp.check(urlOrScheme, (message) => {
          resolve(message);
        }, function(err) {
          reject(err);
        });
      });

      if(!hasPlugin) {
        reject('Plugin not installed');
      }
    });
  }
}
