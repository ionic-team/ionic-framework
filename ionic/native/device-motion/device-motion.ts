import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';
import {Platform} from '../../platform/platform';

@NativePlugin({
  name: 'Device Motion',
  platforms: {
    cordova: 'cordova-plugin-device-motion'
  }
})
export class DeviceMotion {
  static _wrap(result) {
    // Mimic the DeviceMotionEvent
    return {
      acceleration: result,
      accelerationIncludingGravity: result,
      rotationRate: 0,
      interval: 0,
      native: true
    }
  }

  static getCurrentAcceleration() {
    return new Promise((resolve, reject) => {
      if(window.DeviceMotionEvent || ('listenForDeviceMovement' in window)) {
        var fnCb = function fnCb(eventData) {
          console.log('Event', eventData);
          resolve(eventData);
          window.removeEventListener('devicemotion', fnCb);
        }
        window.addEventListener('devicemotion', fnCb);
      } else if(navigator.accelerometer) {
        navigator.accelerometer.getCurrentAcceleration(function (result) {
          resolve(DeviceMotion._wrap(result));
        }, function (err) {
          reject(err);
        });
      else {
        this.pluginWarn();
        reject('The Device does not support device motion events.');
        return;
      }
    });
  }

  static watchAcceleration(options) {
    if(window.DeviceMotionEvent || ('listenForDeviceMovement' in window)) {
      let watchID;

      let source = Rx.Observable.create((observer) => {

        var fnCb = function fnCb(eventData) {
          console.log(eventData);
          observer.onNext(eventData);
        };

        window.addEventListener('devicemotion', fnCb);

      });

      return {
        source: source,
        watchID: watchID,
        clear: () => {
          window.removeEventListener('devicemotion', cbFn);
        }
      }
    } else if(navigator.accelerometer) {
      let watchID;

      let source = Rx.Observable.create((observer) => {

        watchID = navigator.accelerometer.watchAcceleration(function (result) {
          observer.onNext(result);
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
