import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
 * Get geolocation data.
 *
 * @usage
 * ```js
 * Geolocation.getCurrentPosition().then((resp) => {
 *  //resp.coords.latitude
 *  //resp.coords.longitude
 * })
 *
 * let watch = Geolocation.watchPosition();
 * watch.source.subscribe((data) => {
 *  //data.coords.latitude
 *  //data.coords.longitude
 * })
 * ```
 */
@NativePlugin({
  name: 'Geolocation',
  platforms: ['ios', 'android', 'web'],
  engines: {
    cordova: 'cordova-plugin-geolocation'
  }
})
export class Geolocation {
  /**
   * Get the current GPS location.
   */
  static getCurrentPosition(options) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(function (result) {
        resolve(result);
      }, function (err) {
        reject(err);
      }, options);
    });
  }

  /**
   * Watch for location changes.
   */
  static watchPosition(options) {
    let watchID;

    let source = Rx.Observable.create((observer) => {
      watchID = navigator.geolocation.watchPosition(function (result) {
        observer.onNext(result)
      }, function(err) {
        observer.onError(err, observer);
      }, options);
    })

    return {
      source: source,
      watchID: watchID,
      clear: () => {
        navigator.geolocation.clearWatch(watchID);
      }
    }
  }

  /**
   * Clear a specific watch by watch ID. Generally, you'll call
   * clear() on the returned watch from `getCurrentPosition` or `watchPosition` above.
   */
  static clearWatch(watchID) {
    return navigator.geolocation.clearWatch(watchID);
  }
}
