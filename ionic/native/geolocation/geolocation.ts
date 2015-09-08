import * as util from 'ionic/util';

import * as Rx from 'rx';

export class Geolocation {
  static getCurrentPosition(options) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(function (result) {
        resolve(result);
      }, function (err) {
        reject(err);
      }, options);
    });
  }

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

  static clearWatch(watchID) {
    return navigator.geolocation.clearWatch(watchID);
  }
}
