/**
* @ngdoc service
* @name Config
* @module ionic
* @description
* Config allows you to set the modes of your components
*/

import {Platform} from '../platform/platform';
import {isObject, isDefined, isFunction, isArray, extend} from '../util/util';

/**
 * Config lets you change multiple or a single value in an apps mode configuration. Things such as tab placement, icon changes, and view animations can be set here.
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
 * Config can be overwritting at multiple levels, allowing deeper configuration. Taking the example from earlier, we can override any setting we want based on a platform.
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
 * <ion-tabs tabbar-placement="top">
 *    <ion-tab tab-title="Dash" tab-icon="pulse" [root]="tabRoot"></ion-tab>
 *  </ion-tabs>
 * ```
 *
 * The property will override anything else set in the apps.
 *
 * The last way we could configure is through URL query strings. This is useful for testing while in the browser.
 * Simply add `?ionic<PROPERTYNAME>=<value>` to the url.
 *
 * ```
 * http://localhost:8100/?ionicTabbarPlacement=bottom
 * ```
**/
export class Config {

  constructor(config) {
    this._s = config && isObject(config) && !isArray(config) ? config : {};
    this._c = {}; // cached values
  }

 /**
  * For setting and getting multiple config values
  */

/**
 * @private
 * @name settings()
 * @description
 */
  settings() {
    const args = arguments;

    switch (args.length) {

      case 0:
        return this._s;

      case 1:
        // settings({...})
        this._s = args[0];
        this._c = {}; // clear cache
        break;

      case 2:
        // settings('ios', {...})
        this._s.platforms = this._s.platforms || {};
        this._s.platforms[args[0]] = args[1];
        this._c = {}; // clear cache
        break;
    }

    return this;
  }

/**
* For setting a single config values
*/
/**
 * @private
 * @name set()
 * @description
 */
  set() {
    const args = arguments;
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
  * For getting a single config values
  */
/**
 * @private
 * @name get()
 * @description
 */
  get(key) {

    if (!isDefined(this._c[key])) {

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

      if (this._platform) {
        let queryStringValue = this._platform.query('ionic' + key.toLowerCase());
        if (isDefined(queryStringValue)) {
          return this._c[key] = (queryStringValue === 'true' ? true : queryStringValue === 'false' ? false : queryStringValue);
        }

        // check the platform settings object for this value
        // loop though each of the active platforms

        // array of active platforms, which also knows the hierarchy,
        // with the last one the most important
        let activePlatformKeys = this._platform.platforms();

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
    if (isFunction(this._c[key])) {
      return this._c[key](this._platform);
    }

    return this._c[key];
  }

  /**
   * @private
   */
  setPlatform(platform) {
    this._platform = platform;
  }

  static setModeConfig(mode, config) {
    modeConfigs[mode] = config;
  }

  static getModeConfig(mode) {
    return modeConfigs[mode] || null;
  }

}

let modeConfigs = {};
