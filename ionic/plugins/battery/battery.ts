import * as util from 'ionic/util';

import {NativePlugin} from '../plugin';

@NativePlugin({
  name: 'Battery',
  platforms: ['ios', 'android', 'web'],
  engines: {
    cordova: 'cordova-plugin-battery-status'
  }
})
export class Battery {
  static getStatus() {
    return new Promise((resolve, reject) => {
      if(navigator.getBattery) {

        navigator.getBattery().then((battery) => {
          this.battery = battery;
          resolve(Battery._format(battery));
        });

      } else {

        var fnCb = function fnCb(battery) {
          resolve(battery);
          window.removeEventListener('batterystatus', fnCb);
        }
        window.addEventListener('batterystatus', fnCb);
      }
    });
  }
  static _format(batteryObj) {
    if(typeof batteryObj.isPlugged !== 'undefined') {
      // This is the old format, map it to the new format
      util.extend(batteryObj, {
        charging: batteryObj.isPlugged,
        level: batteryObj.level / 100,
        chargingTime: 0, //not provided,
        dischargingTime: 0 //not provided
      });
    }
    return batteryObj;
  }
}
