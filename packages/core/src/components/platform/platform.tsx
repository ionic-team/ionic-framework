import { Component, Element, Method, Prop } from '@stencil/core';

import { PlatformConfig } from '../../index';
import { isCordova } from '../../global/platform-utils';

@Component({
  tag: 'ion-platform',
})
export class Platform {

  @Prop({ context: 'platforms' }) _platforms: PlatformConfig[];
  @Prop({ context: 'readQueryParam'}) readQueryParam: (url: string, key: string) => string;
  @Element() el: HTMLElement;

  /**
   * Depending on the platform the user is on, `is(platformName)` will
   * return `true` or `false`. Note that the same app can return `true`
   * for more than one platform name. For example, an app running from
   * an iPad would return `true` for the platform names: `mobile`,
   * `ios`, `ipad`, and `tablet`. Additionally, if the app was running
   * from Cordova then `cordova` would be true, and if it was running
   * from a web browser on the iPad then `mobileweb` would be `true`.
   *
   * *
   * ```
   * import { Platform } from 'ionic-angular';
   *
   * @Component({...})
   * export MyPage {
   *   constructor(public platform: Platform) {
   *     if (this.platform.is('ios')) {
   *       // This will only print when on iOS
   *       console.log('I am an iOS device!');
   *     }
   *   }
   * }
   * ```
   *
   * | Platform Name   | Description                        |
   * |-----------------|------------------------------------|
   * | android         | on a device running Android.       |
   * | cordova         | on a device running Cordova.       |
   * | core            | on a desktop device.               |
   * | ios             | on a device running iOS.           |
   * | ipad            | on an iPad device.                 |
   * | iphone          | on an iPhone device.               |
   * | mobile          | on a mobile device.                |
   * | mobileweb       | in a browser on a mobile device.   |
   * | phablet         | on a phablet device.               |
   * | tablet          | on a tablet device.                |
   * | windows         | on a device running Windows.       |
   *
   * @param {string} platformName
   */
  @Method()
  is(platformName: string): boolean {
    for (const platform of this._platforms) {
      if (platform.name === platformName) {
        return true;
      }
    }
    return false;
  }

  /**
   * @returns {array} the array of platforms
   * @description
   * Depending on what device you are on, `platforms` can return multiple values.
   * Each possible value is a hierarchy of platforms. For example, on an iPhone,
   * it would return `mobile`, `ios`, and `iphone`.
   *
   * ```
   * import { Platform } from 'ionic-angular';
   *
   * @Component({...})
   * export MyPage {
   *   constructor(public platform: Platform) {
   *     // This will print an array of the current platforms
   *     console.log(this.platform.platforms());
   *   }
   * }
   * ```
   */
  @Method()
  platforms() {
    return this._platforms.map(platform => platform.name);
  }

  @Method()
  versions() {
    return this._platforms;
  }

  /**
   * Returns whether the device is in landscape orientation
   */
  @Method()
  isLandscape(): boolean {
    return !this.isPortrait();
  }

  /**
   * Returns whether the device is in portration orientation
   */
  @Method()
  isPortrait(): boolean {
    return window.matchMedia('(orientation: portrait)').matches;
  }

  @Method()
  ready() {
    // revisit this later on
    if (isCordova()) {
      const cordovaPlatform = this.el.querySelector('ion-cordova-plaform') as any;
      return cordovaPlatform.componentOnReady().then(() => {
        return cordovaPlatform.ready();
      });
    }
    return Promise.resolve();
  }

  @Method()
  getQueryParam(param: string): string {
    return this.readQueryParam(window.location.href, param);
  }

  render() {
    return [
      isCordova() && <ion-cordova-platform/>
    ];
  }

}
