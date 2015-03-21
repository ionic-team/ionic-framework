import * as Platform from './platform';
import * as util from './util';

// TODO stop hardcoding platforms and media sizes

/*
 config
   .set({ side: 'left' })
   .set('threshold', 50)
   .platform('ios')
     .set('side', 'top')
     .unset('threshold')
     .media('lg')
       .set('side', 'right')

config.platform('ios')
  .behavior(function() {
    do something
  })
  .defaults({
    side: 'right'
  })
  
config.platform('ios').media('tablet')
  .defaults({
    side: 'bottom'
  });
*/


/*
 User wants to remove the default behavior for sidemenu, but that's stuck under `.platform('ios').`

config.platform('ios').media('tablet') === config.media('tablet').platform('ios')
*/
var QUERIES = {
  sm: true,
  md: true,
  lg: true
};
var PLATFORMS = {
  ios: true,
  android: true
};

function isPlatform(key = '') {
  return key.toLowerCase() in PLATFORMS;
}
function isMedia(key = '') {
  return key.toLowerCase() in QUERIES;
}
class ConfigCase {
  constructor({ root, parent, path }) {
    this._root = root;
    this._parent = parent;
    this._path = path || [];
    this._values = {};
    this.behaviors = [];
  }
  platform(key = '') {
    if (isPlatform(key)) return this._root._addCase(key, this);
    return this;
  }
  media(key = '') {
    if (isMedia(key)) return this._root._addCase(key, this);
    return this;
  }
  when(condition = '') {
    if (isPlatform(condition) || isMedia(condition)) {
      return this._root._addCase(condition, this);
    }
    return this;
  }
  behavior(fn) {
    this.behaviors.push(fn);
    return this;
  }
  set(a, b) {
    if (util.isString(a)) {
      this._values[a] = b;
    } else {
      util.extend(this._values, a || {});
    }
    return this;
  }
  unset(key) {
    delete this._values[key];
    return this;
  }
  get(key) {
    return util.isDefined(this._values[key]) ? 
      this._values[key] :
      (this._parent ? this._parent.get(key) : undefined);
  }
}

export class IonConfig extends ConfigCase {
  constructor() {
    this._root = this;
    this._cases = {};
    super({
      root: this, 
      parent: null, 
      path: '' 
    });
  }
  invoke(instance) {
    return invokeConfig(this, instance);
  }
  _addCase(key, baseCase) {
    var path = baseCase._path.slice();
    path.push(key);

    // Remove empties & duplicates
    path = path
      .filter((value, index) => {
        return value && path.indexOf(value) === index;
      })
      .sort();

    if (path.join(' ') === baseCase._path.join(' ')) {
      return baseCase;
    }
    return this._createCase(path);
  }
  _createCase(path) {
    if (!path.length) return this;
    var pathStr = path.join(' ');
    var configCase = this._cases[pathStr];
    if (!configCase) {
      var parentPath = path.slice(0, path.length - 1);
      configCase = this._cases[pathStr] = new ConfigCase({
        root: this, 
        parent: this._createCase(parentPath), 
        path: path
      });
    }
    return configCase;
  }
}

export function invokeConfig(config, object, opts = {}) {
  util.defaults(opts, { media: 'lg', platform: 'ios' });
  var { platform, media } = opts;

  var passedCases = [config].concat(
    Object.keys(config._cases)
      .map(name => config._cases[name])
      .filter(configCasePasses)
      .sort(function(a,b) {
        return a._path.length < b._path.length ? -1 : 1;
      })
  );

  // Extend the given object with the values of all the passed cases, starting with the
  // most specific.
  var defaults = [object];
  var behaviors = [];
  for (let i = 0, ii = passedCases.length; i < ii; i++) {
    defaults.push(passedCases[i]._values);
    // Avoid allocating a new array for each passed case's array of behaviors
    behaviors.push.apply(behaviors, passedCases[i].behaviors);
  }

  util.defaults.apply(null, defaults);

  for (let i = 0, ii = behaviors.length; i < ii; i++) {
    behaviors[i].call(object, object);
  }

  function configCasePasses(configCase) {
    var path = configCase._path;
    var key;
    for (let i = 0, ii = path.length; i < ii; i++) {
      if (!(media === path[i] || platform === path[i])) return false;
    }
    return true;
  }

}
