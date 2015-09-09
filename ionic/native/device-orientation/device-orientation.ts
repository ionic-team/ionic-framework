import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';
import {Platform} from '../../platform/platform';

@NativePlugin({
  name: 'Device Orientation',
  platforms: {
    cordova: 'cordova-plugin-device-orientation'
  }
})
export class DeviceOrientation {
  static _wrap(result) {
    return result;
  }

  static getCurrentAcceleration() {
    return new Promise((resolve, reject) => {
      if(window.DeviceOrientationEvent) {
        var fnCb = function fnCb(eventData) {
          resolve(eventData);
          window.removeEventListener('deviceorientation', fnCb);
        }
        window.addEventListener('deviceorientation', fnCb);
      } else if(navigator.compass) {
        navigator.compass.getCurrentHeading(function (result) {
          resolve(DeviceOrientation._wrap(result));
        }, function (err) {
          reject(err);
        });
      } else {
        this.pluginWarn();
        reject('The Device does not support device orientation events.');
        return;
      }
    });
  }

  static watchHeading(options) {
    if(window.DeviceOrientationEvent) {
      let watchID;

      let source = Rx.Observable.create((observer) => {

        var fnCb = function fnCb(eventData) {
          console.log(eventData);
          observer.onNext(eventData);
        };

        window.addEventListener('deviceorientation', fnCb);

      });

      return {
        source: source,
        watchID: watchID,
        clear: () => {
          window.removeEventListener('deviceorientation', fnCb);
        }
      }
    } else if(navigator.accelerometer) {
      let watchID;

      let source = Rx.Observable.create((observer) => {

        watchID = navigator.compass.watchHeading(function (result) {
          observer.onNext(result);
        }, function (err) {
          observer.onError(err, observer);
        }, options);

      });

      return {
        source: source,
        watchID: watchID,
        clear: () => {
          navigator.compass.clearWatch(watchID);
        }
      }
    }
  }
}
