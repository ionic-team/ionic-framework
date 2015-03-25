import * as util from '../../util';
import {platform} from '../platform/platform';

function isPlatform(key = '') {
  return platform.isRegistered(key.toLowerCase());
}

export class ConfigCase {
  constructor({ root, parent, path }) {
    this._root = root;
    this._parent = parent;
    this._path = path || [];
    this._values = {};
    this._component = null;
  }
  platform(key = '') {
    if (isPlatform(key)) return this._root._addCase(key, this);
    return this;
  }
  // media(key = '') {
  //   if (isMedia(key)) return this._root._addCase(key, this);
  //   return this;
  // }
  when(condition = '') {
    if (isPlatform(condition)) {
      return this._root._addCase(condition, this);
    }
    return this;
  }
  component(Class) {
    this._component = Class;
    return this;
  }
  set(obj) {
    util.extend(this._values, obj);
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
