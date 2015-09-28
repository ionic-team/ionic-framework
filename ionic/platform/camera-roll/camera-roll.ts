import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
 * Save and load photos from the Camera Roll (currently iOS only).
 *
 * Requires the Cordiva plugin `cordova-plugin-camera-roll`
 *
 * @usage
 * ```js
 * CameraRoll.save(base64EncodedImage).then(() => {
 *   // success
 * }, (err) => {})
 */
@NativePlugin({
  name: 'CameraRoll',
  platforms: ['ios'],
  engines: {
    cordova: 'cordova-plugin-camera-roll'
  },
  pluginCheck: () => {
    return !!window.CameraRoll;
  }
})
export class CameraRoll {
  /**
   * Save the base64 encoded image to the camera roll.
   *
   * @param base64String {String} base-64 encoded image
   * @return {Promise}
   */
  static save(base64String) {
    return new Promise((resolve, reject) => {
      this.ifPlugin(() => {
        window.CameraRoll.saveToCameraRoll(base64String, () => {
          resolve();
        }, (err) => {
          reject(err);
        });
      })
    });
  }

  /**
   * Get photos from the camera roll.
   */
  static getPhotos(options) {
    return new Promise((resolve, reject) => {
      this.ifPlugin(() => {
        window.CameraRoll.getPhotos((photos) => {
          resolve(photos);
        });
      })
    });
  }
}
