import * as util from 'ionic/util';

import {NativePlugin} from '../plugin';

/**
 * Track battery status. Uses the HTMl5 Battery API if available or
 * the `cordova-plugin-battery-status` plugin.
 *
 * @usage
 *
 * ```js
 * Battery.getStatus().then((data) => {
 *   console.log(data.charging, data.level, data.chargingTime, data.dischargingTime)
 * });
 * ```
 */
@NativePlugin({
  name: 'Battery',
  platforms: ['ios', 'android', 'web'],
  engines: {
    cordova: 'cordova-plugin-battery-status'
  }
})
export class Battery {

  /**
   * Get the status of the battery. Data is of the format:
   * { charging, level, chargingTime, dischargingTime }
   *
   * Note: certain fields might not be available depending on the platform.
   *
   * @return {object} battery status
   */
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
