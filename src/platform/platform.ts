import { EventEmitter, NgZone, OpaqueToken } from '@angular/core';

import { QueryParams } from './query-params';
import { ready, windowDimensions, flushDimensionCache } from '../util/dom';


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
 * import { Platform } from 'ionic-angular';
 *
 * @Component({...})
 * export MyPage {
 *   constructor(platform: Platform) {
 *     this.platform = platform;
 *   }
 * }
 * ```
 * @demo /docs/v2/demos/src/platform/
 */
export class Platform {
  private _versions: {[name: string]: PlatformVersion} = {};
  private _dir: string;
  private _lang: string;
  private _ua: string;
  private _qp: QueryParams;
  private _bPlt: string;
  private _onResizes: Array<Function> = [];
  private _readyPromise: Promise<any>;
  private _readyResolve: any;
  private _resizeTm: any;
  private _bbActions: BackButtonAction[] = [];
  private _registry: {[name: string]: PlatformConfig};
  private _default: string;

  /** @private */
  zone: NgZone;

  /** @private */
  _platforms: string[] = [];

  constructor() {
    this._readyPromise = new Promise(res => { this._readyResolve = res; } );

    this.backButton.subscribe(() => {
      // the hardware back button event has been fired
      console.debug('hardware back button');

      // decide which backbutton action should run
      this.runBackButtonAction();
    });
  }

  /**
   * @private
   */
  setZone(zone: NgZone) {
    this.zone = zone;
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
   * import { Platform } from 'ionic-angular';
   *
   * @Component({...})
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
   * import { Platform } from 'ionic-angular';
   *
   * @Component({...})
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
   * import { Platform } from 'ionic-angular';
   *
   * @Component({...})
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
    for (var platformName in this._versions) {
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
   * import { Component } from '@angular/core';
   * import { Platform } from 'ionic-angular';
   *
   * @Component({...})
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
    this.zone.run(() => {
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
   * @private
   */
  exitApp() {}

  // Events meant to be triggered by the engine
  // **********************************************

  /**
   * @private
   */
  backButton: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * The pause event emits when the native platform puts the application
   * into the background, typically when the user switches to a different
   * application. This event would emit when a Cordova app is put into
   * the background, however, it would not fire on a standard web browser.
   */
  pause: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * The resume event emits when the native platform pulls the application
   * out from the background. This event would emit when a Cordova app comes
   * out from the background, however, it would not fire on a standard web browser.
   */
  resume: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * The back button event is triggered when the user presses the native
   * platform's back button, also referred to as the "hardware" back button.
   * This event is only used within Cordova apps running on Android and
   * Windows platforms. This event is not fired on iOS since iOS doesn't come
   * with a hardware back button in the same sense an Android or Windows device
   * does.
   *
   * Registering a hardware back button action and setting a priority allows
   * apps to control which action should be called when the hardware back
   * button is pressed. This method decides which of the registered back button
   * actions has the highest priority and should be called.
   *
   * @param {Function} callback Called when the back button is pressed,
   * if this registered action has the highest priority.
   * @param {number} priority Set the priority for this action. Only the highest priority will execute. Defaults to `0`.
   * @returns {Function} A function that, when called, will unregister
   * the its back button action.
   */
  registerBackButtonAction(fn: Function, priority: number = 0): Function {
    const action: BackButtonAction = {fn, priority};

    this._bbActions.push(action);

    // return a function to unregister this back button action
    return () => {
      let index = this._bbActions.indexOf(action);
      if (index > -1) {
        this._bbActions.splice(index, 1);
      }
    };
  }

  /**
   * @private
   */
  runBackButtonAction() {
    // decide which one back button action should run
    let winner: BackButtonAction = null;
    this._bbActions.forEach((action: BackButtonAction) => {
      if (!winner || action.priority >= winner.priority) {
        winner = action;
      }
    });

    // run the winning action if there is one
    winner && winner.fn && winner.fn();
  }


  // Getter/Setter Methods
  // **********************************************

  /**
   * @private
   */
  setUserAgent(userAgent: string) {
    this._ua = userAgent;
  }

  /**
   * @private
   */
  setQueryParams(queryParams: QueryParams) {
    this._qp = queryParams;
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
   * Gets the width of the platform's viewport using `window.innerWidth`.
   * Using this method is preferred since the dimension is a cached value,
   * which reduces the chance of multiple and expensive DOM reads.
   */
  width(): number {
    return windowDimensions().width;
  }

  /**
   * Gets the height of the platform's viewport using `window.innerHeight`.
   * Using this method is preferred since the dimension is a cached value,
   * which reduces the chance of multiple and expensive DOM reads.
   */
  height(): number {
    return windowDimensions().height;
  }

  /**
   * Returns `true` if the app is in portait mode.
   */
  isPortrait(): boolean {
    return this.width() < this.height();
  }

  /**
   * Returns `true` if the app is in landscape mode.
   */
  isLandscape(): boolean {
    return !this.isPortrait();
  }

  /**
   * @private
   */
  windowResize() {
    const self = this;
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
   */
  onResize(cb: Function): Function {
    let self = this;
    self._onResizes.push(cb);

    return function() {
      const index = self._onResizes.indexOf(cb);
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
  setPlatformConfigs(platformConfigs: {[key: string]: PlatformConfig}) {
    this._registry = platformConfigs || {};
  }

  /**
   * @private
   */
  getPlatformConfig(platformName: string): PlatformConfig {
    return this._registry[platformName] || {};
  }

  /**
   * @private
   */
  registry() {
    return this._registry;
  }

  /**
   * @private
   */
  setDefault(platformName: string) {
    this._default = platformName;
  }

  /**
   * @private
   */
  testQuery(queryValue: string, queryTestValue: string): boolean {
    const valueSplit = queryValue.toLowerCase().split(';');
    return valueSplit.indexOf(queryTestValue) > -1;
  }

  /**
   * @private
   */
  testNavigatorPlatform(navigatorPlatformExpression: string): boolean {
    const rgx = new RegExp(navigatorPlatformExpression, 'i');
    return rgx.test(this._bPlt);
  }

  /**
   * @private
   */
  matchUserAgentVersion(userAgentExpression: RegExp): any {
    if (this._ua && userAgentExpression) {
      const val = this._ua.match(userAgentExpression);
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
    const queryValue = this._qp.get('ionicplatform');
    if (queryValue) {
      return this.testQuery(queryValue, queryStringName);
    }

    userAgentAtLeastHas = userAgentAtLeastHas || [queryStringName];

    const userAgent = this._ua.toLowerCase();

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

  /** @private */
  init() {
    let rootPlatformNode: PlatformNode;
    let enginePlatformNode: PlatformNode;

    // figure out the most specific platform and active engine
    let tmpPlatform: PlatformNode;
    for (let platformName in this._registry) {

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
      rootPlatformNode = new PlatformNode(this._registry, this._default);
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
        insertSuperset(this._registry, platformNode);
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
        platformNode.initialize(this);

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
    let platformNode = new PlatformNode(this._registry, platformName);
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

function insertSuperset(registry: any, platformNode: PlatformNode) {
  let supersetPlaformName = platformNode.superset();
  if (supersetPlaformName) {
    // add a platform in between two exist platforms
    // so we can build the correct hierarchy of active platforms
    let supersetPlatform = new PlatformNode(registry, supersetPlaformName);
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

  constructor(public registry: {[name: string]: PlatformConfig}, platformName: string) {
    this.c = registry[platformName];
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

  initialize(platform: Platform) {
    this.c.initialize && this.c.initialize(platform);
  }

  version(p: Platform): PlatformVersion {
    if (this.c.versionParser) {
      const v = this.c.versionParser(p);
      if (v) {
        const str = v.major + '.' + v.minor;
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

      let platformNode: PlatformNode = null;
      let rootPlatformNode: PlatformNode = null;

      for (let i = 0; i < parents.length; i++) {
        platformNode = new PlatformNode(this.registry, parents[i]);
        platformNode.child = this;

        rootPlatformNode = platformNode.getRoot(p);
        if (rootPlatformNode) {
          this.parent = platformNode;
          return rootPlatformNode;
        }
      }
    }

    return null;
  }

  getSubsetParents(subsetPlatformName: string): string[] {
    const parentPlatformNames: string[] = [];
    let platform: PlatformConfig = null;

    for (let platformName in this.registry) {
      platform = this.registry[platformName];

      if (platform.subsets && platform.subsets.indexOf(subsetPlatformName) > -1) {
        parentPlatformNames.push(platformName);
      }
    }

    return parentPlatformNames;
  }

}


export interface PlatformConfig {
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

interface BackButtonAction {
  fn: Function;
  priority: number;
}


/**
 * @private
 */
export function setupPlatform(platformConfigs: {[key: string]: PlatformConfig}, queryParams: QueryParams, userAgent: string, navigatorPlatform: string, docDirection: string, docLanguage: string, zone: NgZone): Platform {
  const p = new Platform();
  p.setDefault('core');
  p.setPlatformConfigs(platformConfigs);
  p.setUserAgent(userAgent);
  p.setQueryParams(queryParams);
  p.setNavigatorPlatform(navigatorPlatform);
  p.setDir(docDirection, false);
  p.setLang(docLanguage, false);
  p.setZone(zone);
  p.init();
  return p;
}


/**
 * @private
 */
export const UserAgentToken = new OpaqueToken('USERAGENT');
/**
 * @private
 */
export const NavigatorPlatformToken = new OpaqueToken('NAVPLT');
/**
 * @private
 */
export const DocumentDirToken = new OpaqueToken('DOCDIR');
/**
 * @private
 */
export const DocLangToken = new OpaqueToken('DOCLANG');
