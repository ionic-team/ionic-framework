import * as Platform from './platform';

export function IonConfigService() {

  function Config() {
    this._platforms = {};
    for (var key in Config._platforms) {
      this._platforms[key] = Config._platforms[key]._clone();
    }
  }
  Config._platforms = {};
  Config.platform = platformFn.bind(Config);
  Config.prototype.platform = platformFn;

  function platformFn(name) {
    return this._platforms[name] || (this._platforms[name] = new SubConfig(name));
  }

  return Config;
}

class SubConfig {
  constructor(name, mixins = [], template = '') {
    this._name = name;
    this._mixins = mixins;
    this._template = template;
  }
  mixin(mixinFn) {
    this._mixins.push(mixinFn);
    return this;
  }
  template(url) {
    this._template = url;
    return this;
  }
  _clone() {
    return new SubConfig(this._name, this._mixins.slice(), this._template);
  }
}
