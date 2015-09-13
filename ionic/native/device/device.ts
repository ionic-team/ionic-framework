import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';


@NativePlugin({
  name: 'Device',
  platforms: {
    cordova: 'cordova-plugin-device'
  }
})
export class Device {
  /**
   * Returns the whole device object.
   * @see https://github.com/apache/cordova-plugin-device
   * @returns {Object} The device object.
   */
  static getDevice() {
    return this.ifPlugin(window.device, () => {
      return device;
    }, () => {
      return {}
    });
  }

  /**
   * Returns the Cordova version.
   * @see https://github.com/apache/cordova-plugin-device#devicecordova
   * @returns {String} The Cordova version.
   */
  static getCordova() {
    this.ifPlugin(window.device, () => {
      return device.cordova;
    });
  }

  /**
   * Returns the name of the device's model or product.
   * @see https://github.com/apache/cordova-plugin-device#devicemodel
   * @returns {String} The name of the device's model or product.
   */
  static getModel() {
    this.ifPlugin(window.device, () => {
      return device.model;
    }, () => {
      return 'unknown'
    });
  }

  /**
   * @deprecated device.name is deprecated as of version 2.3.0. Use device.model instead.
   * @returns {String}
   */
  static getName() {
    this.ifPlugin(window.device, () => {
      return device.name;
    }, () => {
      return 'unknown'
    });
  }

  /**
   * Returns the device's operating system name.
   * @see https://github.com/apache/cordova-plugin-device#deviceplatform
   * @returns {String} The device's operating system name.
   */
  static getPlatform() {
    this.ifPlugin(window.device, () => {
      return device.name;
    }, () => {
      return 'unknown'
    });
  }

  /**
   * Returns the device's Universally Unique Identifier.
   * @see https://github.com/apache/cordova-plugin-device#deviceuuid
   * @returns {String} The device's Universally Unique Identifier
   */
  static getUUID() {
    this.ifPlugin(window.device, () => {
      return device.uuid;
    }, () => {
      return 'unknown';
    });
  }

  /**
   * Returns the operating system version.
   * @see https://github.com/apache/cordova-plugin-device#deviceversion
   * @returns {String}
   */
  static getVersion() {
    this.ifPlugin(window.device, () => {
      return device.version;
    }, () => {
      return 'unknown';
    });
  }

  /**
   * Returns the device manufacturer.
   * @returns {String}
   */
  static getManufacturer() {
    this.ifPlugin(window.device, () => {
      return device.manufacturer;
    }, () => {
      return 'unknown';
    });
  }
}
