import {IonicPlatform} from '../platform/platform';
import {isObject, isDefined, isFunction, extend} from '../util/util';

/**
* TODO
*/
export class IonicConfig {

 /**
  * TODO
  * @param  {Object} settings   The settings for your app
  */
  constructor(settings={}) {
    this._s = settings;
    this._c = {}; // cached values
  }

 /**
  * For setting and getting multiple config values
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
  }

 /**
  * For setting a single config values
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
  get(key) {

    if (!isDefined(this._c[key])) {
      // if the value was already set this will all be skipped
      // if there was no user config then it'll check each of
      // the user config's platforms, which already contains
      // settings from default platform configs
      this._c[key] = null;

      let userPlatformValue = undefined;
      let platformValue = undefined;
      let userDefaultValue = this._s[key];
      let modeValue = undefined;

      if (this._platform) {
        // check the platform settings object for this value
        // loop though each of the active platforms
        let platformObj = null;

        // array of active platforms, which also knows the hierarchy,
        // with the last one the most important
        let activePlatformKeys = this._platform.platforms();

        // loop through all of the active platforms we're on
        for (let i = 0; i < activePlatformKeys.length; i++) {

          // get user defined platform values
          if (this._s.platforms) {
            platformObj = this._s.platforms[ activePlatformKeys[i] ];
            if (platformObj && isDefined(platformObj[key])) {
              userPlatformValue = platformObj[key];
            }
          }

          // get default platform's setting
          platformObj = IonicPlatform.get(activePlatformKeys[i]);
          if (platformObj && platformObj.settings) {

            if (isDefined(platformObj.settings[key])) {
              // found a setting for this platform
              platformValue = platformObj.settings[key];
            }

            platformObj = IonicConfig.modeConfig(platformObj.settings.mode);
            if (platformObj && isDefined(platformObj[key])) {
              // found setting for this platform's mode
              modeValue = platformObj[key];
            }

          }

        }
      }

      // cache the value
      this._c[key] = isDefined(userPlatformValue) ? userPlatformValue : isDefined(platformValue) ? platformValue : isDefined(userDefaultValue) ? userDefaultValue : isDefined(modeValue) ? modeValue : null;
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
   * TODO
   * @param  {Object} platform   The platform
   */
  setPlatform(platform) {
    this._platform = platform;
  }

  static modeConfig(mode, config) {
    const args = arguments;

    if (args.length === 2) {
      // modeConfig('ios', {...})
      modeConfigs[mode] = extend(modeConfigs[mode] || {}, config);

    } else {
      // modeConfig('ios')
      return modeConfigs[mode];
    }

  }

}

let modeConfigs = {};
