import {isString, isObject, isDefined} from '../util/util';


export class IonicConfig {

  constructor(settings={}) {
    this._settings = settings;
    this._settings.platforms = this._settings.platforms || {};
  }

  platform(val) {
    if (arguments.length) {
      this._platform = val;
    }
    return this._platform;
  }

  setting() {
    const args = arguments;
    const arg0 = args[0];
    const arg1 = args[1];
    const arg2 = args[2];
    const arg3 = args[3];
    const argLength = args.length;

    let s = this._settings;

    if (argLength === 0) {
      // setting() = get settings object
      return s;

    } else if (argLength === 1) {
      // setting({...}) = set settings object
      // setting('key') = get value

      if (isObject(arg0)) {
        // setting({...}) = set settings object
        // arg0 = setting object
        s = arg0;

      } else if (isString(arg0)) {
        // setting('key') = get value
        // arg0 = key
        return s[arg0]
      }

    } else if (argLength === 2) {
      // setting('key', 'value') = set key/value pair
      // arg0 = key
      // arg1 = value
      s[arg0] = arg1;

    } else if (argLength > 2) {
      // create platform object and platformKey object if needed
      // arg0 = key
      // arg1 = platform key
      s.platforms = s.platforms || {};
      s.platforms[arg1] = s.platforms[arg1] || {};

      if (argLength === 3) {
        // setting('key', 'ios', 'value') = set key/value pair for platform
        // arg0 = key
        // arg1 = platform key
        // arg2 = value
        s.platforms[arg1][arg0] = arg2;

      } else if (argLength === 4) {
        // setting('key', 'ios', 'ipad', 'value') = set key/value pair for platform/device
        // arg0 = key
        // arg1 = platform key
        // arg2 = device key
        // arg3 = value
        s.platforms[arg1] = s.platforms[arg1] || {};
      }

    }

    if (arguments.length > 1) {
      this._settings[key] = val;

    } else {
      // 1) user platform settings
      // 2) user settings
      // 3) platform settings
      let tmp = null;

      if (this._platform) {
        tmp = this.platformSetting( this._platform.name() );
        if (isDefined(tmp)) {
          return tmp;
        }
      }

      tmp = this._settings[key];
      if (util.isDefined(tmp)) {
        return tmp;
      }

      if (this._platform) {
        return this._platform.setting(key);
      }

      return null;
    }
  }

  platformSettings(platformName, platformSettings) {
    let settings = this._settings.platforms[platformName] = this._settings.platforms[platformName] || {};
    if (arguments.length > 1) {
      settings = platformSettings || {};
    }
    return settings;
  }

  platformSetting(platformName, key, val) {
    let settings = this._settings.platforms[platformName] = this._settings.platforms[platformName] || {};
    if (arguments.length > 2) {
      settings[key] = val;
    }
    return settings[key];
  }

}
