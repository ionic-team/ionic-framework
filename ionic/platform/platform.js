import * as util from '../util/util';


export class Platform {

  constructor() {
    this._settings = {};
    this._platforms = [];
  }

  is(platformName) {
    return (this._platforms.indexOf(platformName) > -1);
  }

  settings(val) {
    if (arguments.length) {
      this._settings = val;
    }
    return this._settings;
  }

  run() {
    let config = null;

    for (var i = 0; i < this._platforms.length; i++) {
      config = Platform.get(this._platforms[i]);
      config.run && config.run();
    }
  }

  add(platformName) {
    this._platforms.push(platformName);
  }


  /* Static Methods */
  static create(app) {
    let rootNode = null;

    function matchPlatform(platformConfig) {
      let platformNode = new PlatformNode();
      platformNode.config(platformConfig);
      let tmpPlatform = platformNode.getRoot(app, 0);

      if (tmpPlatform) {
        tmpPlatform.depth = 0;
        let childPlatform = tmpPlatform.child();
        while(childPlatform) {
          tmpPlatform.depth++
          childPlatform = childPlatform.child();
        }

        if (!rootNode || tmpPlatform.depth > rootNode.depth) {
          rootNode = tmpPlatform;
        }
      }
    }

    function insertSuperset(platformNode) {
      let supersetPlaformName = platformNode.superset();
      if (supersetPlaformName) {
        let supersetPlatform = new PlatformNode();
        supersetPlatform.load(supersetPlaformName);
        supersetPlatform.parent(platformNode.parent());
        supersetPlatform.child(platformNode);
        supersetPlatform.parent().child(supersetPlatform);
        platformNode.parent(supersetPlatform);
      }
    }

    for (let platformName in platformRegistry) {
      matchPlatform( platformRegistry[platformName] );
    }

    let platform = new Platform();
    if (rootNode) {
      let platformNode = rootNode.child();
      while (platformNode) {
        insertSuperset(platformNode);
        platformNode = platformNode.child();
      }

      platformNode = rootNode.child();
      let settings = {};
      while (platformNode) {
        platform.add(platformNode.name());
        util.extend(settings, platformNode.settings());
        platformNode = platformNode.child();
      }

      platform.settings(settings);
    }

    return platform;
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


class PlatformNode {

  load(platformName) {
    this._c = Platform.get(platformName);
  }

  config(val) {
    this._c = val;
  }

  settings() {
    return this._c.settings || {};
  }

  name() {
    return this._c.name;
  }

  superset() {
    return this._c.superset;
  }

  runAll() {
    let platform = this;
    while (platform) {
      platform.run();
      platform = platform.child();
    }
    return false;
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
    if (typeof this._c._isMatched !== 'boolean') {
      // only do the actual check once
      if (!this._c.isMatch) {
        this._c._isMatched = true;
      } else {
        this._c._isMatched = this._c.isMatch(app);
      }
    }
    return this._c._isMatched;
  }

  getRoot(app) {
    if (this.isMatch(app)) {

      let parents = Platform.getSubsetParents(this.name());

      if (!parents.length) {
        return this;
      }

      let platform = null;
      let rootPlatform = null;

      for (let i = 0; i < parents.length; i++) {
        platform = new PlatformNode();
        platform.load(parents[i]);
        platform.child(this);

        rootPlatform = platform.getRoot(app);
        if (rootPlatform) {
          this.parent(platform);
          return rootPlatform;
        }
      }
    }

    return null;
  }

}

let platformRegistry = {};

