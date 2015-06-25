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

  platforms() {
    // get the array of active platforms, which also knows the hierarchy,
    // with the last one the most important
    return this._platforms;
  }


  /* Static Methods */
  static create(app) {
    let rootPlatformNode = null;
    let engineNode = null;

    function matchPlatform(platformConfig) {
      // build a PlatformNode and assign config data to it
      // use it's getRoot method to build up its hierarchy
      // depending on which platforms match
      let platformNode = new PlatformNode();
      platformNode.isEngine = platformConfig.isEngine;
      platformNode.config(platformConfig);
      let tmpPlatform = platformNode.getRoot(app, 0);

      if (tmpPlatform) {
        tmpPlatform.depth = 0;
        let childPlatform = tmpPlatform.child();
        while(childPlatform) {
          tmpPlatform.depth++
          childPlatform = childPlatform.child();
        }
      }
      return tmpPlatform;
    }

    function insertSuperset(platformNode) {
      let supersetPlaformName = platformNode.superset();
      if (supersetPlaformName) {
        // add a platform in between two exist platforms
        // so we can build the correct hierarchy of active platforms
        let supersetPlatform = new PlatformNode();
        supersetPlatform.load(supersetPlaformName);
        supersetPlatform.parent(platformNode.parent());
        supersetPlatform.child(platformNode);
        supersetPlatform.parent().child(supersetPlatform);
        platformNode.parent(supersetPlatform);
      }
    }

    // figure out the most specific platform and active engine
    let tmpPlatform = null;
    for (let platformName in platformRegistry) {

      tmpPlatform = matchPlatform( platformRegistry[platformName] );
      if (tmpPlatform) {
        // we found a platform match!
        // check if its more specific than the one we already have

        if (tmpPlatform.isEngine) {
          // because it matched then this should be the active engine
          // you cannot have more than one active engine
          engineNode = tmpPlatform;

        } else if (!rootPlatformNode || tmpPlatform.depth > rootPlatformNode.depth) {
          // only find the root node for platforms that are not engines
          // set this node as the root since we either don't already
          // have one, or this one is more specific that the current one
          rootPlatformNode = tmpPlatform;
        }
      }
    }

    // build a Platform instance filled with the
    // hierarchy of active platforms and settings
    let platform = new Platform();
    if (rootPlatformNode) {

      // check if we found an engine node (cordova/node-webkit/etc)
      if (engineNode) {
        // add the engine to the first in the platform hierarchy
        // the original rootPlatformNode now becomes a child
        // of the engineNode, which is not the new root
        engineNode.child(rootPlatformNode);
        rootPlatformNode.parent(engineNode);
        rootPlatformNode = engineNode;
      }

      let platformNode = rootPlatformNode;
      while (platformNode) {
        insertSuperset(platformNode);
        platformNode = platformNode.child();
      }

      platformNode = rootPlatformNode;
      let settings = {};
      while (platformNode) {
        // set the array of active platforms with
        // the last one in the array the most important
        platform.add(platformNode.name());

        // copy default platform settings into this platform settings obj
        settings[platformNode.name()] = util.extend({}, platformNode.settings());

        // go to the next platform child
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

