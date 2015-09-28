import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';


/**
 * Respond to device orientation changes (compass).
 *
 * @usage
 * ```js
 * let watch = DeviceOrientation.watchHeading();
 * watch.source.subscribe((data) => {
 *  // data.alpha is the compass heading
 * })
 *
 * watch.clear() // to stop watching
 * ```
 */
@NativePlugin({
  name: 'Device Orientation',
  platforms: ['ios', 'android', 'web'],
  engines: {
    cordova: 'cordova-plugin-device-orientation'
  }
})
export class DeviceOrientation {
  static _wrap(result) {
    return util.extend({
      alpha: result.magneticHeading,
      magneticHeading: result.webkitCompassHeading || result.alpha
    }, result);
  }

  static getCurrentHeading() {
    return new Promise((resolve, reject) => {
      if(window.DeviceOrientationEvent) {
        var fnCb = function fnCb(eventData) {
          resolve(DeviceOrientation._wrap(eventData));
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
          observer.onNext(DeviceOrientation._wrap(eventData));
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
          observer.onNext(DeviceOrientation._wrap(result));
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
