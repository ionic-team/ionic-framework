import * as util from '../util/util';
import * as dom from '../util/dom';


/**
 * TODO
 */
export class PlatformCtrl {

  constructor() {
    this._settings = {};
    this._platforms = [];
    this._versions = {};
    this._registry = {};
    this._default = null;
    this._onResizes = [];
    this._dimensions = {};
    this._dimIds = 0;

    this._readyPromise = new Promise(res => { this._readyResolve = res; } );
  }


  // Methods
  // **********************************************

  /**
   * TODO
   * @param {TODO} platformName  TODO
   * @returns {TODO} TODO
   */
  is(platformName) {
    return (this._platforms.indexOf(platformName) > -1);
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  platforms() {
    // get the array of active platforms, which also knows the hierarchy,
    // with the last one the most important
    return this._platforms;
  }

  /**
   * TODO
   * @param {TODO} platformName  TODO
   * @returns {TODO} TODO
   */
  versions(platformName) {
    if (arguments.length) {
      // get a specific platform's version
      return this._versions[platformName];
    }

    // get all the platforms that have a valid parsed version
    return this._versions;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  ready() {
    return this._readyPromise;
  }

  /**
   * TODO
   * @param {TODO} config  TODO
   * @returns {TODO} TODO
   */
  prepareReady(config) {
    let self = this;

    function resolve() {
      self._readyResolve(config);
    }

    if (this._engineReady) {
      // the engine provide a ready promise, use this instead
      this._engineReady(resolve);

    } else {
      // there is no custom ready method from the engine
      // use the default dom ready
      dom.ready(resolve);
    }
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  domReady() {
    // convenience method so its easy to access on Platform
    return dom.ready.apply(this, arguments);
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  windowLoad() {
    // convenience method so its easy to access on Platform
    return dom.windowLoad.apply(this, arguments);
  }


  // Methods meant to be overridden by the engine
  // **********************************************
  // Provided NOOP methods so they do not error when
  // called by engines (the browser) doesn't provide them
  on() {}
  onHardwareBackButton() {}
  registerBackButtonAction() {}
  exitApp() {}
  fullScreen() {}
  showStatusBar() {}



  // Getter/Setter Methods
  // **********************************************

  url(val) {
    if (arguments.length) {
      this._url = val;
      this._qs = util.getQuerystring(val);
    }
    return this._url;
  }

  query(key) {
    return (this._qs || {})[key];
  }

  userAgent(val) {
    if (arguments.length) {
      this._ua = val;
    }
    return this._ua;
  }

  navigatorPlatform(val) {
    if (arguments.length) {
      this._bPlt = val;
    }
    return this._bPlt || '';
  }

  width() {
    if (!this._w) {
      this._w = window.innerWidth;
      this._h = window.innerHeight;
    }
    return this._w;
  }

  height() {
    if (!this._h) {
      this._w = window.innerWidth;
      this._h = window.innerHeight;
    }
    return this._h;
  }

  isPortrait() {
    return this.width() < this.height();
  }

  isLandscape() {
    return !this.isPortrait();
  }

  winResize() {
    clearTimeout(Platform._resizeTimer);

    Platform._resizeTimer = setTimeout(() => {
      Platform.flushDimensions();

      for (let i = 0; i < Platform._onResizes.length; i++) {
        try {
          Platform._onResizes[i]();
        } catch (e) {
          console.error(e);
        }
      }
    }, 500);
  }

  onResize(cb) {
    // TODO: Make more good
    this._onResizes.push(cb);
  }

  /**
   * Get the element offsetWidth and offsetHeight. Values are cached to
   * reduce DOM reads, and reset on a window resize.
   * @param {TODO} platformConfig  TODO
   */
  getDimensions(component) {
    // cache
    if (!component._dimId) {
      component._dimId = ++this._dimIds;
    }

    let dimensions = this._dimensions[component._dimId];
    if (!dimensions) {
      let ele = component.getNativeElement();

      dimensions = this._dimensions[component._dimId] = {
        w: ele.offsetWidth,
        h: ele.offsetHeight
      };
    }

    return dimensions;
  }

  flushDimensions() {
    this._dimensions = {};
    this._w = this._h = 0;
  }


  // Registry
  // **********************************************

  /**
   * TODO
   * @param {TODO} platformConfig  TODO
   */
  register(platformConfig) {
    this._registry[platformConfig.name] = platformConfig;
  }

  registry() {
    return this._registry;
  }

  setDefault(platformName) {
    this._default = platformName;
  }

  /**
   * TODO
   * @param {TODO} queryValue  TODO
   * @returns {boolean} TODO
   */
  testQuery(queryValue) {
    let val = this.query('ionicplatform');
    if (val) {
      let valueSplit = val.toLowerCase().split(';');
      for (let i = 0; i < valueSplit.length; i++) {
        if (valueSplit[i] == queryValue) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * TODO
   * @param {TODO} userAgentExpression  TODO
   * @returns {boolean} TODO
   */
  testUserAgent(userAgentExpression) {
    let rgx = new RegExp(userAgentExpression, 'i');
    return rgx.test(this._ua);
  }

  /**
   * TODO
   * @param {TODO} userAgentExpression  TODO
   * @returns {Object} TODO
   */
  matchUserAgentVersion(userAgentExpression) {
    let val = this._ua.match(userAgentExpression);
    if (val) {
      return {
        major: val[1],
        minor: val[2]
      }
    }
  }

  /**
   * TODO
   * @param {TODO} queryValue  TODO
   * @param {TODO} userAgentExpression  TODO
   * @returns {boolean} TODO
   */
  isPlatform(queryValue, userAgentExpression) {
    if (!userAgentExpression) {
      userAgentExpression = queryValue;
    }
    return this.testQuery(queryValue) ||
           this.testUserAgent(userAgentExpression);
  }

  /**
   * TODO
   * @param {TODO} config  TODO
   */
  load(config) {
    let rootPlatformNode = null;
    let engineNode = null;
    let self = this;

    this.platformOverride = config.setting('platform');

    // figure out the most specific platform and active engine
    let tmpPlatform = null;
    for (let platformName in this._registry) {

      tmpPlatform = this.matchPlatform(platformName);
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

    if (!rootPlatformNode) {
      rootPlatformNode = new PlatformNode(this._default);
    }

    // build a Platform instance filled with the
    // hierarchy of active platforms and settings

    if (rootPlatformNode) {

      // check if we found an engine node (cordova/node-webkit/etc)
      if (engineNode) {
        // add the engine to the first in the platform hierarchy
        // the original rootPlatformNode now becomes a child
        // of the engineNode, which is not the new root
        engineNode.child(rootPlatformNode);
        rootPlatformNode.parent(engineNode);
        rootPlatformNode = engineNode;

        // add any events which the engine would provide
        // for example, Cordova provides its own ready event
        let engineMethods = engineNode.methods();
        engineMethods._engineReady = engineMethods.ready;
        delete engineMethods.ready;
        util.extend(this, engineMethods);
      }

      let platformNode = rootPlatformNode;
      while (platformNode) {
        insertSuperset(platformNode);
        platformNode = platformNode.child();
      }

      // make sure the root noot is actually the root
      // incase a node was inserted before the root
      platformNode = rootPlatformNode.parent();
      while (platformNode) {
        rootPlatformNode = platformNode;
        platformNode = platformNode.parent();
      }

      platformNode = rootPlatformNode;
      while (platformNode) {
        // set the array of active platforms with
        // the last one in the array the most important
        this._platforms.push(platformNode.name());

        // copy default platform settings into this platform settings obj
        this._settings[platformNode.name()] = util.extend({}, platformNode.settings());

        // get the platforms version if a version parser was provided
        this._versions[platformNode.name()] = platformNode.version(this);

        // go to the next platform child
        platformNode = platformNode.child();
      }
    }
  }

  /**
   * TODO
   * @param {TODO} platformName  TODO
   * @returns {TODO} TODO
   */
  matchPlatform(platformName) {
    // build a PlatformNode and assign config data to it
    // use it's getRoot method to build up its hierarchy
    // depending on which platforms match
    let platformNode = new PlatformNode(platformName);
    let rootNode = platformNode.getRoot(this, 0);

    if (rootNode) {
      rootNode.depth = 0;
      let childPlatform = rootNode.child();
      while (childPlatform) {
        rootNode.depth++
        childPlatform = childPlatform.child();
      }
    }
    return rootNode;
  }

  settings(val) {
    if (arguments.length) {
      this._settings = val;
    }
    return this._settings;
  }

  /**
   * TODO
   * @param {TODO} platformName  TODO
   * @returns {string} TODO
   */
  get(platformName) {
    return this._registry[platformName] || {};
  }

}

function insertSuperset(platformNode) {
  let supersetPlaformName = platformNode.superset();
  if (supersetPlaformName) {
    // add a platform in between two exist platforms
    // so we can build the correct hierarchy of active platforms
    let supersetPlatform = new PlatformNode(supersetPlaformName);
    supersetPlatform.parent(platformNode.parent());
    supersetPlatform.child(platformNode);
    if (supersetPlatform.parent()) {
      supersetPlatform.parent().child(supersetPlatform);
    }
    platformNode.parent(supersetPlatform);
  }
}


class PlatformNode {

  constructor(platformName) {
    this.c = Platform.get(platformName);
    this.isEngine = this.c.isEngine;
  }

  name() {
    return this.c.name;
  }

  settings() {
    return this.c.settings || {};
  }

  superset() {
    return this.c.superset;
  }

  methods() {
    return this.c.methods || {};
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

  isMatch(p) {
    if (typeof this.c.isMatched !== 'boolean') {
      if (p.platformOverride && !this.isEngine) {
        this.c.isMatched = (p.platformOverride === this.c.name);
      } else if (!this.c.isMatch) {
        this.c.isMatched = false;
      } else {
        this.c.isMatched = this.c.isMatch(p);
      }
    }
    return this.c.isMatched;
  }

  version(p) {
    if (this.c.versionParser) {
      let v = this.c.versionParser(p);
      if (v) {
        let str = v.major + '.' + v.minor;
        return {
          str: str,
          num: parseFloat(str),
          major: parseInt(v.major, 10),
          minor: parseInt(v.minor, 10)
        };
      }
    }
  }

  getRoot(p) {
    if (this.isMatch(p)) {

      let parents = this.getSubsetParents(this.name());

      if (!parents.length) {
        return this;
      }

      let platform = null;
      let rootPlatform = null;

      for (let i = 0; i < parents.length; i++) {
        platform = new PlatformNode(parents[i]);
        platform.child(this);

        rootPlatform = platform.getRoot(p);
        if (rootPlatform) {
          this.parent(platform);
          return rootPlatform;
        }
      }
    }

    return null;
  }

  getSubsetParents(subsetPlatformName) {
    let registry = Platform.registry();

    let parentPlatformNames = [];
    let platform = null;

    for (let platformName in registry) {
      platform = registry[platformName];

      if (platform.subsets && platform.subsets.indexOf(subsetPlatformName) > -1) {
        parentPlatformNames.push(platformName);
      }
    }

    return parentPlatformNames;
  }

}

export let Platform = new PlatformCtrl();
