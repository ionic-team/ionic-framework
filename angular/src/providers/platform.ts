
import { PlatformConfig } from '@ionic/core';
import { Injectable } from '@angular/core';

@Injectable()
export class Platform {

  private _platforms: PlatformConfig[] = [];
  private _readyPromise: Promise<any>;

  constructor() {
    let readyResolve: Function;
    this._readyPromise = new Promise(res => { readyResolve = res; } );
    if ((window as any)['cordova']) {
      window.addEventListener('deviceready', () => {
        readyResolve();
      });
    } else {
      readyResolve();
    }
  }

  /**
   * @returns {boolean} returns true/false based on platform.
   * @description
   * Depending on the platform the user is on, `is(platformName)` will
   * return `true` or `false`. Note that the same app can return `true`
   * for more than one platform name. For example, an app running from
   * an iPad would return `true` for the platform names: `mobile`,
   * `ios`, `ipad`, and `tablet`. Additionally, if the app was running
   * from Cordova then `cordova` would be true, and if it was running
   * from a web browser on the iPad then `mobileweb` would be `true`.
   *
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
   * | electron        | in Electron on a desktop device.   |
   *
   * @param {string} platformName
   */
  is(platformName: string): boolean {
    return this._platforms.some(p => p.name === platformName);
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
  platforms(): string[] {
    return this._platforms.map(platform => platform.name);
  }

  /**
   * Returns an object containing version information about all of the platforms.
   *
   * ```
   * import { Platform } from 'ionic-angular';
   *
   * @Component({...})
   * export MyPage {
   *   constructor(public platform: Platform) {
   *     // This will print an object containing
   *     // all of the platforms and their versions
   *     console.log(platform.versions());
   *   }
   * }
   * ```
   *
   * @returns {object} An object containing all of the platforms and their versions.
   */
  versions(): PlatformConfig[] {
    return this._platforms.slice();
  }


  ready(): Promise<void> {
    return this._readyPromise;
  }

  get isRTL(): boolean {
    return document.dir === 'rtl';
  }


  /**
   * Get the query string parameter
   */
  getQueryParam(key: string): string {
    return readQueryParam(window.location.href, key);
  }

  isLandscape(): boolean {
    return !this.isPortrait();
  }

  isPortrait(): boolean {
    return window.matchMedia('(orientation: portrait)').matches;
  }

  testUserAgent(expression: string): boolean {
    return navigator.userAgent.indexOf(expression) >= 0;
  }

  url() {
    return window.location.href;
  }

  width() {
    return window.innerWidth;
  }

  height(): number {
    return window.innerHeight;
  }
}

function readQueryParam(url: string, key: string) {
  key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
  const results = regex.exec(url);
  return results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : null;
}
