import {isString, isObject, isDefined, isFunction, extend} from '../util/util';


export class IonicConfig {

  constructor(settings) {
    this.setting(settings || {});
  }

  setting() {
    const args = arguments;
    const arg0 = args[0];
    const arg1 = args[1];

    let s = this._settings;

    switch (args.length) {

      case 0:
        // setting() = get settings object
        return s;


      case 1:
        // setting({...}) = set settings object
        // setting('key') = get value

        if (isObject(arg0)) {
          // setting({...}) = set settings object
          // arg0 = setting object
          this._settings = arg0;
          return this;
        }

        // time for the big show, get the value
        // setting('key') = get value
        // arg0 = key

        if (!isDefined(s[arg0])) {
          // if the value was already set this will all be skipped
          // if there was no user config then it'll check each of
          // the user config's platforms, which already contains
          // settings from default platform configs
          s[arg0] = null;

          // check the platform settings object for this value
          // loop though each of the active platforms
          let activePlatformKeys = this._platforms;
          let platformSettings = s.platforms;
          let platformObj = null;
          if (platformSettings) {
            let platformValue = undefined;
            for (let i = 0; i < activePlatformKeys.length; i++) {
              platformObj = platformSettings[ activePlatformKeys[i] ];
              if (platformObj && isDefined(platformObj[arg0])) {
                platformValue = platformObj[arg0];
              }
            }
            if (isDefined(platformValue)) {
              s[arg0] = platformValue;
            }
          }
        }

        // return key's value
        // either it came directly from the user config
        // or it was from the users platform configs
        // or it was from the default platform configs
        // in that order
        if (isFunction(s[arg0])) {
          return s[arg0]();
        }
        return s[arg0];


      case 2:
        // setting('ios', {...}) = set platform config object
        // setting('key', 'value') = set key/value pair
        if (isObject(arg1)) {
          // setting('ios', {...}) = set platform config object
          // arg0 = platform
          // arg1 = platform config object
          s.platforms = s.platforms || {};
          s.platforms[arg0] = arg1;

        } else {
          // setting('key', 'value') = set key/value pair
          // arg0 = key
          // arg1 = value
          s[arg0] = arg1;
        }
        return this;


      case 3:
        // setting('ios', 'key', 'value') = set key/value pair for platform
        // arg0 = platform
        // arg1 = key
        // arg2 = value
        s.platforms = s.platforms || {};
        s.platforms[arg0] = s.platforms[arg0] || {};
        s.platforms[arg0][arg1] = args[2];
        return this;

    }

  }

  setPlatform(platform) {
    // get the array of active platforms, which also knows the hierarchy,
    // with the last one the most important
    this._platforms = platform.platforms();

    // copy default platform settings into the user config platform settings
    // user config platform settings should override default platform settings
    this._settings.platforms = extend(platform.settings(), this._settings.platforms || {});
  }

}
