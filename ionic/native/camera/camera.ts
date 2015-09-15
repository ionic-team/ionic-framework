import * as util from 'ionic/util';

import {NativePlugin} from '../plugin';

@NativePlugin({
  name: 'Camera',
  platforms: {
    cordova: 'cordova-plugin-camera'
  }
})
export class Camera {
  static getPicture(options) {
    return new Promise((resolve, reject) => {
      if (!navigator.camera) {
        this.pluginWarn();
        resolve(null);
        return;
      }

      var options = util.defaults({
        quality: 80,
        destinationType: window.Camera.DestinationType.DATA_URL,
        sourceType: window.Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: window.Camera.EncodingType.JPEG,
        popoverOptions: window.CameraPopoverOptions,
        saveToPhotoAlbum: false
      }, options);

      navigator.camera.getPicture(function (imageData) {
        resolve(imageData);
      }, function (err) {
        reject(err);
      }, options);
    });
  }
  static cleanup() {
    return new Promise((resolve, reject) => {
      navigator.camera.cleanup(function () {
        resolve();
      }, function (err) {
        reject(err);
      });
    });
  }
}
