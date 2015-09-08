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
  getCurrentAcceleration() {
    return new Promise((resolve, reject) => {
      if(navigator.accelerometer) {
        navigator.accelerometer.getCurrentAcceleration(function (result) {
          resolve(result);
        }, function (err) {
          reject(err);
        });
      } else if(window.DeviceMotionEvent || ('listenForDeviceMovement' in window)) {
        var fnCb = function fnCb(eventData) {
          resolve(eventData);
          window.removeEventListener('devicemotion', fnCb);
        }
        window.addEventListener('devicemotion', fnCb);
      } else {
        this.pluginWarn();
        reject('The Device does not support device motion events.');
        return;
      }
    });
  }

  watchAcceleration(options) {
    if(navigator.accelerometer) {
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
    } else {
      let watchID;

      let source = Rx.Observable.create((observer) => {

        var fnCb = function fnCb(eventData) {
          observer.onNext(eventData);
        };

        window.addEventListener('devicemotion', cbFn);

      });

      return {
        source: source,
        watchID: watchID,
        clear: () => {
          window.removeEventListener('devicemotion', cbFn);
        }
      }
    }
  }
}
