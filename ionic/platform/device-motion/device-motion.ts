import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';


/**
 * Respond to device movement in the x/y/z axes.
 *
 * @usage
 * ```js
 * let watch = DeviceMotion.watchAcceleration();
 * watch.source.subscribe((data) => {
 *  // data.acceleration.x
 *  // data.acceleration.y
 *  // data.acceleration.z
 * })
 *
 * watch.clear() // to stop watching
 * ```
 */
@NativePlugin({
  name: 'Device Motion',
  platforms: ['ios', 'android', 'web'],
  engines: {
    cordova: 'cordova-plugin-device-motion'
  }
})
export class DeviceMotion {
  static _wrap(result) {
    // Mimic the DeviceMotionEvent
    return util.extend({
      acceleration: result, // result will be x/y/z accel
      accelerationIncludingGravity: result, //TODO: I know this isn't correct but not sure how to normalize from native plugin
      rotationRate: 0,
      interval: 0,
      native: true
    }, result);
  }

  /**
   * Get the current acceleration from the device. Generally, watchAcceleration
   * is more commonly used.
   *
   * @return {Promise} that resolves with current motion data.
   */
  static getCurrentAcceleration() {
    return new Promise((resolve, reject) => {
      if(window.DeviceMotionEvent || ('listenForDeviceMovement' in window)) {
        var fnCb = function fnCb(eventData) {
          resolve(DeviceMotion._wrap(eventData));
          window.removeEventListener('devicemotion', fnCb);
        }
        window.addEventListener('devicemotion', fnCb);
      } else if(navigator.accelerometer) {
        navigator.accelerometer.getCurrentAcceleration(function (result) {
          resolve(DeviceMotion._wrap(result));
        }, function (err) {
          reject(err);
        });
      } else {
        this.pluginWarn();
        reject('The Device does not support device motion events.');
        return;
      }
    });
  }

  /**
   * Watch for device motion.
   */
  static watchAcceleration(options) {
    if(window.DeviceMotionEvent || ('listenForDeviceMovement' in window)) {
      let watchID;

      let source = Rx.Observable.create((observer) => {

        var fnCb = function fnCb(eventData) {
          observer.onNext(DeviceMotion._wrap(eventData));
        };

        window.addEventListener('devicemotion', fnCb);

      });

      return {
        source: source,
        watchID: watchID,
        clear: () => {
          window.removeEventListener('devicemotion', fnCb);
        }
      }
    } else if(navigator.accelerometer) {
      let watchID;

      let source = Rx.Observable.create((observer) => {

        watchID = navigator.accelerometer.watchAcceleration(function (result) {
          observer.onNext(DeviceMotion._wrap(result));
        }, function (err) {
          observer.onError(err, observer);
        }, options);

      });

      return {
        source: source,
        watchID: watchID,
        clear: () => {
          navigator.accelerometer.clearWatch(watchID);
        }
      }
    }
  }
}
