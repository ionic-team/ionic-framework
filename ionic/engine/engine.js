import * as util from 'ionic/util';


let registry = {};
let defaultEngine;
let activeEngine;

class EngineController {

  constructor() {
    let self = this;
    let proxyMethods = 'ready fullScreen showStatusBar exitApp'.split(' ');
    for (let x = 0; x < proxyMethods.length; x++) {
      this[proxyMethods[x]] = function() {
        return self.proxy(proxyMethods[x], arguments);
      }
    }
  }

  proxy(target, args) {
    let eng = this.get()
    if (eng && eng[target]) {
      return eng[target].apply(this, args);
    }
    return new Promise(resolve => {}, reject => {
      reject();
    });
  }

  is(name) {
    return this.name === name;
  }

  getName() {
    return this.get().name;
  }

  get() {
    if (util.isUndefined(activeEngine)) {
      this.set(this.detect());
    }
    return activeEngine || defaultEngine;
  }

  set(eng) {
    activeEngine = eng;
  }

  setDefault(eng) {
    defaultEngine = eng;
  }

  register(eng) {
    registry[eng.name] = eng;
  }

  detect() {
    for (let name in registry) {
      if (registry[name].isMatch()) {
        return registry[name];
      }
    }
    return null;
  }

}

export let engine = new EngineController();

engine.setDefault({
  name: 'default',
  ready: util.dom.windowLoad
});
