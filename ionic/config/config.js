import {isObject, isDefined} from '../util/util';


export class IonicConfig {

  constructor(settings={}) {
    this.setting(settings);
  }

  platform(platform) {
    this._platform = platform;
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
          break;
        }

        // time for the big show, get the value
        // setting('key') = get value
        // arg0 = key
        if (isDefined(s[arg0])) {
          // value found in users settings object
          return s[arg0];
        }

        // check the users platform settings object
        // loop though each of the active platforms
        let activePlatformKeys = this._platform.platforms();
        let platformSettings = s.platforms;
        if (platformSettings) {
          let platformValue = undefined;
          for (let i = 0; i < activePlatformKeys.length; i++) {
            if ( platformSettings[ activePlatformKeys[i] ] ) {
              platformValue = platformSettings[ activePlatformKeys[i] ][arg0];
            }
          }
          if (isDefined(platformValue)) {
            return platformValue;
          }
        }

        // check the value from the default platform settings
        platformSettings = this._platform.settings();
        if (isDefined(platformSettings[arg0])) {
          return platformSettings[arg0];
        }

        // idk
        return null;


      case 2:
        // setting('ios', {...}) = set platform config object
        // setting('key', 'value') = set key/value pair

        if (isObject(arg1)) {
          // setting('ios', {...}) = set platform config object
          // arg0 = platform
          // arg1 = platform config object
          s.platforms = s.platforms || {};
          s.platforms[arg0] = arg1;
          break;
        }

        // setting('key', 'value') = set key/value pair
        // arg0 = key
        // arg1 = value
        s[arg0] = arg1;
        break;


      case 3:
        // setting('ios', 'key', 'value') = set key/value pair for platform
        // arg0 = platform
        // arg1 = key
        // arg2 = value
        s.platforms = s.platforms || {};
        s.platforms[arg0] = s.platforms[arg0] || {};
        s.platforms[arg0][arg1] = args[2];

    }

  }

}
