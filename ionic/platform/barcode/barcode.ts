import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
 * Scan barcodes and QR codes.
 *
 * @usage
 *
 * ## Scanning a code
 *
 * ```js
 * Barcode.scan().then((data) => {
 *   console.log("Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
 * }, (err) => {
 * })
 * ```
 *
 * ## Encoding data
 *
 * ```js
 * Barcode.encode(Barcode.TEXT_TYPE).then((data) => {}, (fail) => {});
 * ```
 */
@NativePlugin({
  name: 'Barcode',
  platforms: ['ios', 'android'],
  engines: {
    cordova: 'phonegap-plugin-barcodescanner'
  },
  pluginCheck: () => {
    return window.cordova && window.cordova.plugins && window.cordova.plugins.barcodeScanner;
  }
})
export class Barcode {
  static TEXT_TYPE = "TEXT_TYPE"
  static EMAIL_TYPE = "EMAIL_TYPE"
  static PHONE_TYPE = "PHONE_TYPE"
  static SMS_TYPE = "SMS_TYPE"

  /**
   * Scan a barcode.
   *
   * @return Promise that resolves with an object of the format: {
   *   text: text that was scanned,
   *   format: format of barcode,
   *   cancelled: was it canceled?
   * }
   */
  static scan() {
    return new Promise((resolve, reject) => {
      let hasPlugin = this.ifPlugin(() => {
        window.cordova.plugins.barcodeScanner.scan((result) => {
          resolve(result);
        }, (err) => {
          reject(err);
        })
      });

      if(!hasPlugin) {
        reject('No scanner available');
      }
    });
  }

  /**
   * Encode the given data in a barcode.
   *
   * @param type the type to use for encoding (if in doubt, use TYPE_TEXT).
   * @param data the data to encode
   * @return Promise
   */
  static encode(type, data) {
    return new Promise((resolve, reject) => {
      let hasPlugin = this.ifPlugin(() => {
        window.cordova.plugins.barcodeScanner.encode(type, data, (result) => {
          resolve(result);
        }, (err) => {
          reject(err);
        })
      });

      if(!hasPlugin) {
        reject('No scanner available');
      }
    });
  }
}
