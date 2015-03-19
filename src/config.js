import * as Platform from './platform';
import * as util from './util';

export function IonConfig() {

  // TODO automatically add platform class
  // TODO do bindings/defaults have to be written twice?
  // TODO maybe add config to IonicComponent annotation
  // TODO map options to config
  function Config(instance) {
    util.defaults(instance, Config._defaults || {});
    var conditions = Config._conditions;
    for (var i = 0, ii = conditions.length; i < ii; i++) {
      if (conditions[i]._callback(instance)) {
        for (var j = 0, jj = conditions[i]._mixins.length; j < jj; j++) {
          conditions[i]._mixins[j].call(instance);
        }
      }
    }
  }

  Config._conditions = [];
  Config.defaults = function(defaults) {
    Config._defaults = defaults;
  };
  Config.when = function when(callback) {
    var condition = new ConfigCondition(callback);
    Config._conditions.push(condition);
    return condition;
  };
  Config.platform = function platform(name) {
    return Config.when(() => Platform.getPlatform() === name);
  };

  return Config;
}

class ConfigCondition {
  constructor(callback, mixins = [], template = '') {
    this._callback = callback;
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
}
