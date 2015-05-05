import * as util from 'ionic/util'


let registry = {};
let defaultPlatform;
let activePlatform;

class PlatformController {

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
      if (registry[name].isMatch()) {
        return registry[name]
      }
    }
    return null;
  }

  _applyBodyClasses() {
    if(!activePlatform) {
      return;
    }

    util.dom.raf(() => {
      document.body.classList.add('platform-' + activePlatform.name);
    });
  }
}

export let Platform = new PlatformController();


const ua = window.navigator.userAgent;
const queryPlatform = (util.getQuerystring('ionicplatform')).toLowerCase()


Platform.register({
  name: 'android',
  mode: 'md',
  isMatch() {
    return queryPlatform == 'android' || /android/i.test(ua)
  }
});

Platform.register({
  name: 'ios',
  isMatch() {
    return queryPlatform === 'ios' || /ipad|iphone|ipod/i.test(ua)
  }
});

// Last case is a catch-all
Platform.setDefault({
  name: 'core'
});

Platform.set( Platform.detect() );
