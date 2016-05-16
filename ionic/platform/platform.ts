import {EventEmitter, NgZone} from '@angular/core';

import {Config} from '../config/config';
import {getQuerystring} from '../util/util';
import {ready, windowDimensions, flushDimensionCache} from '../util/dom';

/**
 * @name Platform
 * @description
 * The Platform service can be used to get information about your current device.
 * You can get all of the platforms associated with the device using the [platforms](#platforms)
 * method, including whether the app is being viewed from a tablet, if it's
 * on a mobile device or browser, and the exact platform (iOS, Android, etc).
 * You can also get the orientation of the device, if it uses right-to-left
 * language direction, and much much more. With this information you can completely
 * customize your app to fit any device.
 *
 * @usage
 * ```ts
 * import {Platform} from 'ionic-angular';
 *
 * @Page({...})
 * export MyPage {
 *   constructor(platform: Platform) {
 *     this.platform = platform;
 *   }
 * }
 * ```
 * @demo /docs/v2/demos/platform/
 */
export class Platform {
  private _platforms: Array<string>;
  private _versions: {[name: string]: PlatformVersion} = {};
  private _dir: string;
  private _lang: string;
  private _url: string;
  private _qs: any;
  private _ua: string;
  private _bPlt: string;
  private _onResizes: Array<Function> = [];
  private _readyPromise: Promise<any>;
  private _readyResolve: any;
  private _resizeTm: any;
  private _zone: NgZone;

  constructor(platforms = []) {
    this._platforms = platforms;
    this._readyPromise = new Promise(res => { this._readyResolve = res; } );
  }

  /**
   * @private
   */
  setZone(zone: NgZone) {
    this._zone = zone;
  }


  // Methods
  // **********************************************

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
   * import {Platform} from 'ionic-angular';
   *
   * @Page({...})
   * export MyPage {
   *   constructor(platform: Platform) {
   *     this.platform = platform;
   *
   *     if (this.platform.is('ios')) {
   *       // This will only print when on iOS
   *       console.log("I'm an iOS device!");
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
  is(platformName: string): boolean {
    return (this._platforms.indexOf(platformName) > -1);
  }

  /**
   * @returns {array} the array of platforms
   * @description
   * Depending on what device you are on, `platforms` can return multiple values.
   * Each possible value is a hierarchy of platforms. For example, on an iPhone,
   * it would return `mobile`, `ios`, and `iphone`.
   *
   * ```
   * import {Platform} from 'ionic-angular';
   *
   * @Page({...})
   * export MyPage {
   *   constructor(platform: Platform) {
   *     this.platform = platform;
   *
   *     // This will print an array of the current platforms
   *     console.log(this.platform.platforms());
   *   }
   * }
   * ```
   */
  platforms(): Array<string> {
    // get the array of active platforms, which also knows the hierarchy,
    // with the last one the most important
    return this._platforms;
  }


  /**
   * Returns an object containing version information about all of the platforms.
   *
   * ```
   * import {Platform} from 'ionic-angular';
   *
   * @Page({...})
   * export MyPage {
   *   constructor(platform: Platform) {
   *     this.platform = platform;
   *
   *     // This will print an object containing
   *     // all of the platforms and their versions
   *     console.log(platform.versions());
   *   }
   * }
   * ```
   *
   * @returns {object} An object containing all of the platforms and their versions.
   */
  versions(): {[name: string]: PlatformVersion} {
    // get all the platforms that have a valid parsed version
    return this._versions;
  }

  /**
   * @private
   */
  version(): PlatformVersion {
    for (let platformName in this._versions) {
      if (this._versions[platformName]) {
        return this._versions[platformName];
      }
    }
    return {};
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
   * import {App, Platform} from 'ionic-angular';
   *
   * @App({...})
   * export MyApp {
   *   constructor(platform: Platform) {
   *     platform.ready().then((readySource) => {
   *       console.log('Platform ready from', readySource);
   *       // Platform now ready, execute any required native code
   *     });
   *   }
   * }
   * ```
   * @returns {promise}
   */
  ready(): Promise<string> {
    return this._readyPromise;
  }

  /**
   * @private
   * This should be triggered by the engine when the platform is
   * ready. If there was no custom prepareReady method from the engine,
   * such as Cordova or Electron, then it uses the default DOM ready.
   */
  triggerReady(readySource: string) {
    this._zone.run(() => {
      this._readyResolve(readySource);
    });
  }

  /**
   * @private
   * This is the default prepareReady if it's not replaced by an engine,
   * such as Cordova or Electron. If there was no custom prepareReady
   * method from an engine then it uses the method below, which triggers
   * the platform ready on the DOM ready event, and the default resolved
   * value is `dom`.
   */
  prepareReady() {
    ready(() => {
      this.triggerReady('dom');
    });
  }

  /**
  * Set the app's language direction, which will update the `dir` attribute
  * on the app's root `<html>` element. We recommend the app's `index.html`
  * file already has the correct `dir` attribute value set, such as
  * `<html dir="ltr">` or `<html dir="rtl">`. This method is useful if the
  * direction needs to be dynamically changed per user/session.
  * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
  * @param {string} dir  Examples: `rtl`, `ltr`
  */
  setDir(dir: string, updateDocument: boolean) {
    this._dir = (dir || '').toLowerCase();
    if (updateDocument !== false) {
      document.documentElement.setAttribute('dir', dir);
    }
  }

  /**
   * Returns app's language direction.
   * We recommend the app's `index.html` file already has the correct `dir`
   * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
   * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
   * @returns {string}
   */
  dir(): string {
    return this._dir;
  }

  /**
   * Returns if this app is using right-to-left language direction or not.
   * We recommend the app's `index.html` file already has the correct `dir`
   * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
   * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
   * @returns {boolean}
   */
  isRTL(): boolean {
    return (this._dir === 'rtl');
  }

  /**
  * Set the app's language and optionally the country code, which will update
  * the `lang` attribute on the app's root `<html>` element.
  * We recommend the app's `index.html` file already has the correct `lang`
  * attribute value set, such as `<html lang="en">`. This method is useful if
  * the language needs to be dynamically changed per user/session.
  * [W3C: Declaring language in HTML](http://www.w3.org/International/questions/qa-html-language-declarations)
  * @param {string} language  Examples: `en-US`, `en-GB`, `ar`, `de`, `zh`, `es-MX`
  */
  setLang(language: string, updateDocument: boolean) {
    this._lang = language;
    if (updateDocument !== false) {
      document.documentElement.setAttribute('lang', language);
    }
  }

  /**
   * Returns app's language and optional country code.
   * We recommend the app's `index.html` file already has the correct `lang`
   * attribute value set, such as `<html lang="en">`.
   * [W3C: Declaring language in HTML](http://www.w3.org/International/questions/qa-html-language-declarations)
   * @returns {string}
   */
  lang(): string {
    return this._lang;
  }

  // Methods meant to be overridden by the engine
  // **********************************************
  // Provided NOOP methods so they do not error when
  // called by engines (the browser)that do not provide them

  /**
  * The `exitApp` method is useful when running from a native platform,
  * such as Cordova. This adds the ability to place the Cordova app
  * in the background.
  */
  exitApp() {}

  // Events meant to be triggered by the engine
  // **********************************************

  /**
  * The back button event is emitted when the user presses the native
  * platform's back button, also referred to as the "hardware" back button.
  * This event is only emitted within Cordova apps running on Android and
  * Windows platforms. This event is not fired on iOS since iOS doesn't come
  * with a hardware back button in the same sense an Android or Windows device
  * does. It's important to note that this event does not emit when the Ionic
  * app's back button within the navbar is clicked, but this event is only
  * referencing the platform's hardward back button.
  */
  backButton: EventEmitter<any> = new EventEmitter();

  /**
  * The pause event emits when the native platform puts the application
  * into the background, typically when the user switches to a different
  * application. This event would emit when a Cordova app is put into
  * the background, however, it would not fire on a standard web browser.
  */
  pause: EventEmitter<any> = new EventEmitter();

  /**
  * The resume event emits when the native platform pulls the application
  * out from the background. This event would emit when a Cordova app comes
  * out from the background, however, it would not fire on a standard web browser.
  */
  resume: EventEmitter<any> = new EventEmitter();


  // Getter/Setter Methods
  // **********************************************

  /**
  * @private
  */
  setUrl(url: string) {
    this._url = url;
    this._qs = getQuerystring(url);
  }

  /**
  * @private
  */
  url(): string {
    return this._url;
  }

  /**
  * @private
  */
  query(key: string): string {
    return (this._qs || {})[key];
  }

  /**
  * @private
  */
  setUserAgent(userAgent: string) {
    this._ua = userAgent;
  }

  /**
  * @private
  */
  userAgent(): string {
    return this._ua || '';
  }

  /**
  * @private
  */
  setNavigatorPlatform(navigatorPlatform: string) {
    this._bPlt = navigatorPlatform;
  }

  /**
  * @private
  */
  navigatorPlatform(): string {
    return this._bPlt || '';
  }

  /**
  * @private
  */
  width(): number {
    return windowDimensions().width;
  }

  /**
  * @private
  */
  height(): number {
    return windowDimensions().height;
  }

  /**
  * @private
  */
  isPortrait(): boolean {
    return this.width() < this.height();
  }

  /**
  * @private
  */
  isLandscape(): boolean {
    return !this.isPortrait();
  }

  /**
  * @private
  */
  windowResize() {
    let self = this;
    clearTimeout(self._resizeTm);

    self._resizeTm = setTimeout(() => {
      flushDimensionCache();

      for (let i = 0; i < self._onResizes.length; i++) {
        try {
          self._onResizes[i]();
        } catch (e) {
          console.error(e);
        }
      }
    }, 200);
  }

  /**
   * @private
   * @returns Unregister function
   */
  onResize(cb: Function): Function {
    let self = this;
    self._onResizes.push(cb);

    return function() {
      let index = self._onResizes.indexOf(cb);
      if (index > -1) {
        self._onResizes.splice(index, 1);
      }
    };
  }


  // Platform Registry
  // **********************************************

  /**
   * @private
   */
  static register(platformConfig: PlatformConfig) {
    platformRegistry[platformConfig.name] = platformConfig;
  }

  /**
  * @private
  */
  static registry() {
    return platformRegistry;
  }

  /**
   * @private
   */
  static get(platformName: string): PlatformConfig {
    return platformRegistry[platformName] || {};
  }

  /**
   * @private
   */
  static setDefault(platformName: string) {
    platformDefault = platformName;
  }

  /**
   * @private
   */
  testQuery(queryValue: string, queryTestValue: string): boolean {
    let valueSplit = queryValue.toLowerCase().split(';');
    return valueSplit.indexOf(queryTestValue) > -1;
  }

  /**
   * @private
   */
  testNavigatorPlatform(navigatorPlatformExpression: string): boolean {
    let rgx = new RegExp(navigatorPlatformExpression, 'i');
    return rgx.test(this._bPlt);
  }

  /**
   * @private
   */
  matchUserAgentVersion(userAgentExpression: RegExp): any {
    if (this._ua && userAgentExpression) {
      let val = this._ua.match(userAgentExpression);
      if (val) {
        return {
          major: val[1],
          minor: val[2]
        };
      }
    }
  }

  /**
   * @private
   */
  isPlatformMatch(queryStringName: string, userAgentAtLeastHas?: string[], userAgentMustNotHave: string[] = []): boolean {
    let queryValue = this.query('ionicplatform');
    if (queryValue) {
      return this.testQuery(queryValue, queryStringName);
    }

    userAgentAtLeastHas = userAgentAtLeastHas || [queryStringName];

    let userAgent = this._ua.toLowerCase();

    for (var i = 0; i < userAgentAtLeastHas.length; i++) {
      if (userAgent.indexOf(userAgentAtLeastHas[i]) > -1) {
        for (var j = 0; j < userAgentMustNotHave.length; j++) {
          if (userAgent.indexOf(userAgentMustNotHave[j]) > -1) {
            return false;
          }
        }
        return true;
      }
    }

    return false;
  }

  /**
   * @private
   */
  load(config: Config) {
    let rootPlatformNode: PlatformNode;
    let enginePlatformNode: PlatformNode;
    let self = this;

    // figure out the most specific platform and active engine
    let tmpPlatform: PlatformNode;
    for (let platformName in platformRegistry) {

      tmpPlatform = this.matchPlatform(platformName);
      if (tmpPlatform) {
        // we found a platform match!
        // check if its more specific than the one we already have

        if (tmpPlatform.isEngine) {
          // because it matched then this should be the active engine
          // you cannot have more than one active engine
          enginePlatformNode = tmpPlatform;

        } else if (!rootPlatformNode || tmpPlatform.depth > rootPlatformNode.depth) {
          // only find the root node for platforms that are not engines
          // set this node as the root since we either don't already
          // have one, or this one is more specific that the current one
          rootPlatformNode = tmpPlatform;
        }
      }
    }

    if (!rootPlatformNode) {
      rootPlatformNode = new PlatformNode(platformDefault);
    }

    // build a Platform instance filled with the
    // hierarchy of active platforms and settings

    if (rootPlatformNode) {

      // check if we found an engine node (cordova/node-webkit/etc)
      if (enginePlatformNode) {
        // add the engine to the first in the platform hierarchy
        // the original rootPlatformNode now becomes a child
        // of the engineNode, which is not the new root
        enginePlatformNode.child = rootPlatformNode;
        rootPlatformNode.parent = enginePlatformNode;
        rootPlatformNode = enginePlatformNode;
      }

      let platformNode = rootPlatformNode;
      while (platformNode) {
        insertSuperset(platformNode);
        platformNode = platformNode.child;
      }

      // make sure the root noot is actually the root
      // incase a node was inserted before the root
      platformNode = rootPlatformNode.parent;
      while (platformNode) {
        rootPlatformNode = platformNode;
        platformNode = platformNode.parent;
      }

      platformNode = rootPlatformNode;
      while (platformNode) {
        platformNode.initialize(this, config);

        // set the array of active platforms with
        // the last one in the array the most important
        this._platforms.push(platformNode.name);

        // get the platforms version if a version parser was provided
        this._versions[platformNode.name] = platformNode.version(this);

        // go to the next platform child
        platformNode = platformNode.child;
      }
    }

    if (this._platforms.indexOf('mobile') > -1 && this._platforms.indexOf('cordova') === -1) {
      this._platforms.push('mobileweb');
    }
  }

  /**
   * @private
   */
  private matchPlatform(platformName: string): PlatformNode {
    // build a PlatformNode and assign config data to it
    // use it's getRoot method to build up its hierarchy
    // depending on which platforms match
    let platformNode = new PlatformNode(platformName);
    let rootNode = platformNode.getRoot(this);

    if (rootNode) {
      rootNode.depth = 0;
      let childPlatform = rootNode.child;
      while (childPlatform) {
        rootNode.depth++;
        childPlatform = childPlatform.child;
      }
    }
    return rootNode;
  }

}

function insertSuperset(platformNode: PlatformNode) {
  let supersetPlaformName = platformNode.superset();
  if (supersetPlaformName) {
    // add a platform in between two exist platforms
    // so we can build the correct hierarchy of active platforms
    let supersetPlatform = new PlatformNode(supersetPlaformName);
    supersetPlatform.parent = platformNode.parent;
    supersetPlatform.child = platformNode;
    if (supersetPlatform.parent) {
      supersetPlatform.parent.child = supersetPlatform;
    }
    platformNode.parent = supersetPlatform;
  }
}

/**
 * @private
 */
class PlatformNode {
  private c: PlatformConfig;

  parent: PlatformNode;
  child: PlatformNode;
  name: string;
  isEngine: boolean;
  depth: number;

  constructor(platformName: string) {
    this.c = Platform.get(platformName);
    this.name = platformName;
    this.isEngine = this.c.isEngine;
  }

  settings(): any {
    return this.c.settings || {};
  }

  superset(): any {
    return this.c.superset;
  }

  isMatch(p: Platform): boolean {
    return this.c.isMatch && this.c.isMatch(p) || false;
  }

  initialize(platform: Platform, config: Config) {
    this.c.initialize && this.c.initialize(platform, config);
  }

  version(p: Platform): PlatformVersion {
    if (this.c.versionParser) {
      let v = this.c.versionParser(p);
      if (v) {
        let str = v.major + '.' + v.minor;
        return {
          str: str,
          num: parseFloat(str),
          major: parseInt(v.major, 10),
          minor: parseInt(v.minor, 10)
        };
      }
    }
  }

  getRoot(p: Platform): PlatformNode {
    if (this.isMatch(p)) {

      let parents = this.getSubsetParents(this.name);

      if (!parents.length) {
        return this;
      }

      let platform = null;
      let rootPlatform = null;

      for (let i = 0; i < parents.length; i++) {
        platform = new PlatformNode(parents[i]);
        platform.child = this;

        rootPlatform = platform.getRoot(p);
        if (rootPlatform) {
          this.parent = platform;
          return rootPlatform;
        }
      }
    }

    return null;
  }

  getSubsetParents(subsetPlatformName: string): Array<string> {
    let platformRegistry = Platform.registry();

    let parentPlatformNames = [];
    let platform = null;

    for (let platformName in platformRegistry) {
      platform = platformRegistry[platformName];

      if (platform.subsets && platform.subsets.indexOf(subsetPlatformName) > -1) {
        parentPlatformNames.push(platformName);
      }
    }

    return parentPlatformNames;
  }

}

let platformRegistry: {[name: string]: PlatformConfig} = {};
let platformDefault: string = null;

export interface PlatformConfig {
  name?: string;
  isEngine?: boolean;
  initialize?: Function;
  isMatch?: Function;
  superset?: string;
  subsets?: string[];
  settings?: any;
  versionParser?: any;
}

export interface PlatformVersion {
  str?: string;
  num?: number;
  major?: number;
  minor?: number;
}
