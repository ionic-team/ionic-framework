import * as util from '../util/util';
import {Tap} from '../util/tap';

let platformRegistry = {};
let defaultPlatform;
let activePlatform;

export class Platform {

  load(platformName) {
    this._c = Platform.get(platformName);
  }

  name() {
    return this._c.name;
  }

  settings() {
    return this._c.settings || {};
  }

  subsets() {
    return this._c.subsets || [];
  }

  run() {
    this._c.run && this._c.run();
  }

  parent(val) {
    if (arguments.length) {
      this._parent = val;
    }
    return this._parent;
  }

  child(val) {
    if (arguments.length) {
      this._child = val;
    }
    return this._child;
  }

  isMatch(app) {
    if (!this._c.isMatch) {
      return true;
    }
    return this._c.isMatch(app);
  }

  getRoot(app, childPlatform) {
    if (this.isMatch(app)) {
      let parents = Platform.getSubsetParents(this.name());

      if (!parents.length) {
        platform = new Platform();
        platform.load(this.name());
        platform.child(childPlatform);
        return platform;
      }

      let platform = null;
      let rootPlatform = null;

      for (let i = 0; i < parents.length; i++) {
        platform = new Platform();
        platform.load(parents[i]);
        platform.child(this);

        rootPlatform = platform.getRoot(app, this);
        if (rootPlatform) {
          this.parent(platform);
          return rootPlatform;
        }
      }
    }

    return null;
  }


  static getActivePlatform(app) {
    let platform = new Platform();
    platform.load('tablet');

    let root = platform.getRoot(app, null);
    console.log(root)
  }

  static register(platform) {
    platformRegistry[platform.name] = platform;
  }

  static get(platformName) {
    return platformRegistry[platformName] || {};
  }

  static getSubsetParents(subsetPlatformName) {
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

let rootPlatform = null;


Platform.register({
  name: 'core',
  subsets: [
    'mobile'
  ],
  settings: {
    mode: 'a'
  },
  run() {
    console.log('Core');
  }
});


Platform.register({
  name: 'mobile',
  subsets: [
    'android',
    'ios'
  ],
  settings: {
    mode: 'b'
  },
  run() {
    console.log('Mobile');
  }
});


Platform.register({
  name: 'android',
  subsets: [
    'tablet'
  ],
  settings: {
    mode: 'c'
  },
  isMatch(app) {
    return app.matchesPlatform('android');
  },
  run() {
    console.log('Android');
  }
});


Platform.register({
  name: 'tablet',
  settings: {
    mode: 'd'
  },
  isMatch(app) {
    return app.height() >= 800 || app.width() >= 800;
  },
  run() {
    console.log('Tablet');
  }
});


Platform.register({
  name: 'ios',
  subsets: [
    'ipad',
    'iphone'
  ],
  settings: {
    mode: 'e'
  },
  isMatch(app) {
    return app.matchesPlatform('ios');
  },
  run() {
    console.log('iOS');
    Tap.run();
  }
});


Platform.register({
  name: 'ipad',
  subsets: [
    'tablet'
  ],
  settings: {
    mode: 'f'
  },
  isMatch(app) {
    return app.matchesDevice('ipad');
  },
  run() {
    console.log('iPad');
  }
});


Platform.register({
  name: 'iphone',
  settings: {
    mode: 'g'
  },
  isMatch(app) {
    return app.matchesDevice('iphone');
  },
  run() {
    console.log('iPhone');
  }
});


