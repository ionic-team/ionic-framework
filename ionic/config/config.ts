/**
* @ngdoc service
* @name Config
* @module ionic
* @description
* Config allows you to set the modes of your components
*/

import {Platform} from '../platform/platform';
import {isObject, isDefined, isFunction, isArray} from '../util/util';

/**
 * @name Config
 * @demo /docs/v2/demos/config/
 * @description
 * The Config lets you configure your entire app or specific platforms.
 * You can set the tab placement, icon mode, animations, and more here.
 *
 * ```ts
 * @App({
 *   template: `<ion-nav [root]="root"></ion-nav>`
 *   config: {
 *     backButtonText: 'Go Back',
 *     iconMode: 'ios',
 *     modalEnter: 'modal-slide-in',
 *     modalLeave: 'modal-slide-out',
 *     tabbarPlacement: 'bottom',
 *     pageTransition: 'ios',
 *   }
 * })
 * ```
 *
 * To change the mode to always use Material Design (md).
 *
 * ```ts
 * @App({
 *   template: `<ion-nav [root]="root"></ion-nav>`
 *   config: {
 *     mode: 'md'
 *   }
 * })
 * ```
 *
 * Config can be overwritten at multiple levels allowing for more configuration. Taking the example from earlier, we can override any setting we want based on a platform.
 * ```ts
 * @App({
 *   template: `<ion-nav [root]="root"></ion-nav>`
 *   config: {
 *     tabbarPlacement: 'bottom',
 *     platforms: {
 *      ios: {
 *        tabbarPlacement: 'top',
 *      }
 *     }
 *   }
 * })
 * ```
 *
 * We could also configure these values at a component level. Take `tabbarPlacement`, we can configure this as a property on our `ion-tabs`.
 *
 * ```html
 * <ion-tabs tabbarPlacement="top">
 *    <ion-tab tabTitle="Dash" tabIcon="pulse" [root]="tabRoot"></ion-tab>
 *  </ion-tabs>
 * ```
 *
 * The last way we could configure is through URL query strings. This is useful for testing while in the browser.
 * Simply add `?ionic<PROPERTYNAME>=<value>` to the url.
 *
 * ```bash
 * http://localhost:8100/?ionicTabbarPlacement=bottom
 * ```
 *
 * Custom values can be added to config, and looked up at a later point in time.
 *
 * ``` javascript
 * config.set('ios', 'favoriteColor', 'green');
 * // from any page in your app:
 * config.get('favoriteColor'); // 'green'
 * ```
 *
 *
 * A config value can come from anywhere and be anything, but there are a default set of values.
 *
 *
 * | Config property            | Default iOS Value      | Default MD Value          |
 * |----------------------------|------------------------|---------------------------|
 * | activator                  | highlight              | ripple                    |
 * | actionSheetEnter           | action-sheet-slide-in  | action-sheet-md-slide-in  |
 * | actionSheetLeave           | action-sheet-slide-out | action-sheet-md-slide-out |
 * | alertEnter                 | alert-pop-in           | alert-md-pop-in           |
 * | alertLeave                 | alert-pop-out          | alert-md-pop-out          |
 * | backButtonText             | Back                   |                           |
 * | backButtonIcon             | ion-ios-arrow-back     | ion-md-arrow-back         |
 * | iconMode                   | ios                    | md                        |
 * | menuType                   | reveal                 | overlay                   |
 * | modalEnter                 | modal-slide-in         | modal-md-slide-in         |
 * | modalLeave                 | modal-slide-out        | modal-md-slide-out        |
 * | pageTransition             | ios-transition         | md-transition             |
 * | pageTransitionDelay        | 16                     | 120                       |
 * | tabbarPlacement            | bottom                 | top                       |
 * | tabbarHighlight            |                        | top                       |
 * | tabbarLayout               |                        |                           |
 * | tabSubPages                |                        | true                      |
 *
**/
export class Config {
  private _c: any = {};
  private _s: any = {};

  /**
   * @private
   */
  platform: Platform;

  constructor(config?) {
    this._s = config && isObject(config) && !isArray(config) ? config : {};
  }


  /**
   * @name get
   * @description
   * Returns a single config value, given a key.
   *
   * @param {string} [key] - the key for the config value
   * @param {any} [fallbackValue] - a fallback value to use when the config
   * value was not found, or is config value is `null`. Fallback value
   *  defaults to `null`.
   */
  get(key: string, fallbackValue: any = null): any {

    if (!isDefined(this._c[key])) {
      if (!isDefined(key)) {
        throw 'config key is not defined';
      }

      // if the value was already set this will all be skipped
      // if there was no user config then it'll check each of
      // the user config's platforms, which already contains
      // settings from default platform configs

      let userPlatformValue = undefined;
      let userDefaultValue = this._s[key];
      let userPlatformModeValue = undefined;
      let userDefaultModeValue = undefined;
      let platformValue = undefined;
      let platformModeValue = undefined;
      let configObj = null;

      if (this.platform) {
        let queryStringValue = this.platform.query('ionic' + key.toLowerCase());
        if (isDefined(queryStringValue)) {
          return this._c[key] = (queryStringValue === 'true' ? true : queryStringValue === 'false' ? false : queryStringValue);
        }

        // check the platform settings object for this value
        // loop though each of the active platforms

        // array of active platforms, which also knows the hierarchy,
        // with the last one the most important
        let activePlatformKeys = this.platform.platforms();

        // loop through all of the active platforms we're on
        for (let i = 0, l = activePlatformKeys.length; i < l; i++) {

          // get user defined platform values
          if (this._s.platforms) {
            configObj = this._s.platforms[activePlatformKeys[i]];
            if (configObj) {
              if (isDefined(configObj[key])) {
                userPlatformValue = configObj[key];
              }
              configObj = Config.getModeConfig(configObj.mode);
              if (configObj && isDefined(configObj[key])) {
                userPlatformModeValue = configObj[key];
              }
            }
          }

          // get default platform's setting
          configObj = Platform.get(activePlatformKeys[i]);
          if (configObj && configObj.settings) {

            if (isDefined(configObj.settings[key])) {
              // found a setting for this platform
              platformValue = configObj.settings[key];
            }

            configObj = Config.getModeConfig(configObj.settings.mode);
            if (configObj && isDefined(configObj[key])) {
              // found setting for this platform's mode
              platformModeValue = configObj[key];
            }

          }

        }

      }

      configObj = Config.getModeConfig(this._s.mode);
      if (configObj && isDefined(configObj[key])) {
        userDefaultModeValue = configObj[key];
      }

      // cache the value
      this._c[key] = isDefined(userPlatformValue) ? userPlatformValue :
                     isDefined(userDefaultValue) ? userDefaultValue :
                     isDefined(userPlatformModeValue) ? userPlatformModeValue :
                     isDefined(userDefaultModeValue) ? userDefaultModeValue :
                     isDefined(platformValue) ? platformValue :
                     isDefined(platformModeValue) ? platformModeValue :
                     null;
    }

    // return key's value
    // either it came directly from the user config
    // or it was from the users platform configs
    // or it was from the default platform configs
    // in that order
    let rtnVal;
    if (isFunction(this._c[key])) {
      rtnVal = this._c[key](this.platform);

    } else {
      rtnVal = this._c[key];
    }

    return (rtnVal !== null ? rtnVal : fallbackValue);
  }


  /**
   * @name getBoolean
   * @description
   * Same as `get()`, however always returns a boolean value. If the
   * value from `get()` is `null`, then it'll return the `fallbackValue`
   * which defaults to `false`. Otherwise, `getBoolean()` will return
   * if the config value is truthy or not. It also returns `true` if
   * the config value was the string value `"true"`.
   * @param {string} [key] - the key for the config value
   * @param {boolean} [fallbackValue] - a fallback value to use when the config
   * value was `null`. Fallback value defaults to `false`.
   */
  getBoolean(key: string, fallbackValue: boolean = false): boolean {
    let val = this.get(key);
    if (val === null) {
      return fallbackValue;
    }
    if (typeof val === 'string') {
      return val === 'true';
    }
    return !!val;
  }


  /**
   * @name getNumber
   * @description
   * Same as `get()`, however always returns a number value. Uses `parseFloat()`
   * on the value received from `get()`. If the result from the parse is `NaN`,
   * then it will return the value passed to `fallbackValue`. If no fallback
   * value was provided then it'll default to returning `NaN` when the result
   * is not a valid number.
   * @param {string} [key] - the key for the config value
   * @param {number} [fallbackValue] - a fallback value to use when the config
   * value turned out to be `NaN`. Fallback value defaults to `NaN`.
   */
  getNumber(key: string, fallbackValue: number = NaN): number {
    let val = parseFloat( this.get(key) );
    return isNaN(val) ? fallbackValue : val;
  }


  /**
   * @name set
   * @description
   * Sets a single config value.
   *
   * @param {string} [platform] - The platform (either 'ios' or 'android') that the config value should apply to. Leaving this blank will apply the config value to all platforms.
   * @param {string} [key] - The key used to look up the value at a later point in time.
   * @param {string} [value] - The config value being stored.
   */
  set(...args: any[]) {
    const arg0 = args[0];
    const arg1 = args[1];

    switch (args.length) {
      case 2:
        // set('key', 'value') = set key/value pair
        // arg1 = value
        this._s[arg0] = arg1;
        delete this._c[arg0]; // clear cache
        break;

      case 3:
        // setting('ios', 'key', 'value') = set key/value pair for platform
        // arg0 = platform
        // arg1 = key
        // arg2 = value
        this._s.platforms = this._s.platforms || {};
        this._s.platforms[arg0] = this._s.platforms[arg0] || {};
        this._s.platforms[arg0][arg1] = args[2];
        delete this._c[arg1]; // clear cache
        break;

    }

    return this;
  }

  /**
   * @private
   * @name settings()
   * @description
   */
  settings(arg0?: any, arg1?: any) {
    switch (arguments.length) {

      case 0:
        return this._s;

      case 1:
        // settings({...})
        this._s = arg0;
        this._c = {}; // clear cache
        break;

      case 2:
        // settings('ios', {...})
        this._s.platforms = this._s.platforms || {};
        this._s.platforms[arg0] = arg1;
        this._c = {}; // clear cache
        break;
    }

    return this;
  }

  /**
   * @private
   */
  setPlatform(platform) {
    this.platform = platform;
  }

  /**
   * @private
   */
  static setModeConfig(mode, config) {
    modeConfigs[mode] = config;
  }

  /**
   * @private
   */
  static getModeConfig(mode) {
    return modeConfigs[mode] || null;
  }

}

let modeConfigs = {};
