import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
 * Manage the appearance of the native status bar.
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
   * Get photos from the camera roll
   */
  static getPhotos(options) {
    return new Promise((resolve, reject) => {
      this.ifPlugin(() => {
        window.CameraRoll.saveToCameraRoll(base64String);
      })
    });
  }
}
