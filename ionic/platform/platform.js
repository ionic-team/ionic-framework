import * as util from '../util/util';
import {Tap} from '../util/tap';

let registry = {};
let defaultPlatform;
let activePlatform;

class PlatformController {

  constructor(platformQuerystring, userAgent) {
    this.pqs = platformQuerystring;
    this.ua = userAgent;
  }

  get() {
    if (util.isUndefined(activePlatform)) {
      this.set(this.detect());
    }
    return activePlatform || defaultPlatform;
  }

  getName() {
    return this.get().name;
  }

  getMode() {
    let plt = this.get();
    return plt.mode || plt.name;
  }

  register(platform) {
    registry[platform.name] = platform;
  }

  getPlatform(name) {
    return registry[name];
  }

  set(platform) {
    activePlatform = platform;

    this._applyBodyClasses();
  }

  setDefault(platform) {
    defaultPlatform = platform;
  }

  isRegistered(platformName) {
    return registry.some(platform => {
      return platform.name === platformName;
    })
  }

  detect() {
    for (let name in registry) {
      if (registry[name].isMatch(this.pqs, this.ua)) {
        return registry[name];
      }
    }
    return null;
  }

  is(name) {
    return activePlatform.name === name;
  }

  _applyBodyClasses() {
    if(!activePlatform) {
      return;
    }

    document.body.classList.add('platform-' + activePlatform.name);
  }

  run() {
    activePlatform && activePlatform.run();
  }
}

export let Platform = new PlatformController((util.getQuerystring('ionicplatform')).toLowerCase(), window.navigator.userAgent);


Platform.register({
  name: 'android',
  mode: 'md',
  isMatch(platformQuerystring, userAgent) {
    if (platformQuerystring) {
      return platformQuerystring == 'android';
    }
    return /android/i.test(userAgent);
  },
  run() {

  }
});

Platform.register({
  name: 'ios',
  isMatch(platformQuerystring, userAgent) {
    if (platformQuerystring) {
      return platformQuerystring == 'ios';
    }
    return /ipad|iphone|ipod/i.test(userAgent);
  },
  run() {
    //Tap.run();
  }
});

// Last case is a catch-all
Platform.setDefault({
  name: 'ios'
});

Platform.set( Platform.getPlatform('ios') );//Platform.detect() );

Platform.run();
