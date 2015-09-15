import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

@NativePlugin({
  name: 'Vibration',
  platforms: {
    cordova: 'cordova-plugin-vibration'
  }
})
export class Vibration {
  static vibrate(pattern) {
    if(!navigator.vibrate) {
      this.pluginWarn();
      console.log('Vibrate (dev): ', pattern);
    } else {
      navigator.vibrate(pattern);
    }
  }
}
