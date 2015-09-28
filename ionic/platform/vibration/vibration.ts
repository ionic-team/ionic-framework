import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
* Vibrate the device. Uses the HTMl5 Vibration API or the `cordova-plugin-vibration` plugin (preferred)
*
* @usage
* ```js
* Vibration.vibrate();
* ```
*/
@NativePlugin({
  name: 'Vibration',
  platforms: ['ios', 'android', 'web'],
  engines: {
    cordova: 'cordova-plugin-vibration'
  }
})
export class Vibration {
  /**
   * Vibrate the device. Note: iOS does not support the pattern parameter.
   *
   * @param pattern the vibration pattern in ms to use [1000,1000,1000] (vibrate three times, one second each)
   */
  static vibrate(pattern) {
    if(!navigator.vibrate) {
      this.pluginWarn();
      console.log('Vibrate (dev): ', pattern);
    } else {
      navigator.vibrate(pattern);
    }
  }
}
