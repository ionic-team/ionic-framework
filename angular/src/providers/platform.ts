import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BackButtonEventDetail, Platforms, getPlatforms, isPlatform } from '@ionic/core';
import { Subject, Subscription } from 'rxjs';

export interface BackButtonEmitter extends Subject<BackButtonEventDetail> {
  subscribeWithPriority(priority: number, callback: () => Promise<any> | void): Subscription;
}

@Injectable({
  providedIn: 'root',
})
export class Platform {

  private _readyPromise: Promise<string>;
  private win: any;

  /**
   * @hidden
   */
  backButton: BackButtonEmitter = new Subject<BackButtonEventDetail>() as any;

  /**
   * The pause event emits when the native platform puts the application
   * into the background, typically when the user switches to a different
   * application. This event would emit when a Cordova app is put into
   * the background, however, it would not fire on a standard web browser.
   */
  pause = new Subject<void>();

  /**
   * The resume event emits when the native platform pulls the application
   * out from the background. This event would emit when a Cordova app comes
   * out from the background, however, it would not fire on a standard web browser.
   */
  resume = new Subject<void>();

  /**
   * The resize event emits when the browser window has changed dimensions. This
   * could be from a browser window being physically resized, or from a device
   * changing orientation.
   */
  resize = new Subject<void>();

  constructor(@Inject(DOCUMENT) private doc: any) {
    this.win = doc.defaultView;

    this.backButton.subscribeWithPriority = function(priority, callback) {
      return this.subscribe(ev => {
        ev.register(priority, callback);
      });
    };

    proxyEvent(this.pause, doc, 'pause');
    proxyEvent(this.resume, doc, 'resume');
    proxyEvent(this.backButton, doc, 'ionBackButton');
    proxyEvent(this.resize, this.win, 'resize');

    let readyResolve: (value: string) => void;
    this._readyPromise = new Promise(res => { readyResolve = res; });
    if (this.win && this.win['cordova']) {
      doc.addEventListener('deviceready', () => {
        readyResolve('cordova');
      }, { once: true });
    } else {
      readyResolve!('dom');
    }
  }

  /**
   * @returns returns true/false based on platform.
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
   * | ios             | on a device running iOS.           |
   * | ipad            | on an iPad device.                 |
   * | iphone          | on an iPhone device.               |
   * | phablet         | on a phablet device.               |
   * | tablet          | on a tablet device.                |
   * | electron        | in Electron on a desktop device.   |
   * | pwa             | as a PWA app.                      |
   * | mobile          | on a mobile device.                |
   * | mobileweb       | on a mobile device in a browser.   |
   * | desktop         | on a desktop device.               |
   * | hybrid          | is a cordova or capacitor app.     |
   *
   */
  is(platformName: Platforms): boolean {
    return isPlatform(this.win, platformName);
  }

  /**
   * @returns the array of platforms
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
    return getPlatforms(this.win);
  }

  /**
   * Returns a promise when the platform is ready and native functionality
   * can be called. If the app is running from within a web browser, then
   * the promise will resolve when the DOM is ready. When the app is running
   * from an application engine such as Cordova, then the promise will
   * resolve when Cordova triggers the `deviceready` event.
   *
   * The resolved value is the `readySource`, which states which platform
   * ready was used. For example, when Cordova is ready, the resolved ready
   * source is `cordova`. The default ready source value will be `dom`. The
   * `readySource` is useful if different logic should run depending on the
   * platform the app is running from. For example, only Cordova can execute
   * the status bar plugin, so the web should not run status bar plugin logic.
   *
   * ```
   * import { Component } from '@angular/core';
   * import { Platform } from 'ionic-angular';
   *
   * @Component({...})
   * export MyApp {
   *   constructor(public platform: Platform) {
   *     this.platform.ready().then((readySource) => {
   *       console.log('Platform ready from', readySource);
   *       // Platform now ready, execute any required native code
   *     });
   *   }
   * }
   * ```
   */
  ready(): Promise<string> {
    return this._readyPromise;
  }

  /**
   * Returns if this app is using right-to-left language direction or not.
   * We recommend the app's `index.html` file already has the correct `dir`
   * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
   * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
   */
  get isRTL(): boolean {
    return this.doc.dir === 'rtl';
  }

  /**
   * Get the query string parameter
   */
  getQueryParam(key: string): string | null {
    return readQueryParam(this.win.location.href, key);
  }

  /**
   * Returns `true` if the app is in landscape mode.
   */
  isLandscape(): boolean {
    return !this.isPortrait();
  }

  /**
   * Returns `true` if the app is in portait mode.
   */
  isPortrait(): boolean {
    return this.win.matchMedia && this.win.matchMedia('(orientation: portrait)').matches;
  }

  testUserAgent(expression: string): boolean {
    const nav = this.win.navigator;
    return !!(nav && nav.userAgent && nav.userAgent.indexOf(expression) >= 0);
  }

  /**
   * Get the current url.
   */
  url() {
    return this.win.location.href;
  }

  /**
   * Gets the width of the platform's viewport using `window.innerWidth`.
   */
  width() {
    return this.win.innerWidth;
  }

  /**
   * Gets the height of the platform's viewport using `window.innerHeight`.
   */
  height(): number {
    return this.win.innerHeight;
  }
}

const readQueryParam = (url: string, key: string) => {
  key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
  const results = regex.exec(url);
  return results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : null;
};

const proxyEvent = <T>(emitter: Subject<T>, el: EventTarget, eventName: string) => {
  if ((el as any)) {
    el.addEventListener(eventName, (ev: Event | undefined | null) => {
      // ?? cordova might emit "null" events
      emitter.next(ev != null ? (ev as any).detail as T : undefined);
    });
  }
};
