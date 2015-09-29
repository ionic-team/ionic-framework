/**
 * Storage is an easy way to store key/value pairs and other complicated
 * data in a way that uses a variety of storage engines underneath.
 *
 * For most cases, we recommend the SqlStorage system as it will store
 * data in a file in the app's sandbox. LocalStorage should ONLY be used
 * for temporary data as it may be "cleaned up" by the operation system
 * during low disk space situations.
 */
export class Storage {
  constructor(strategyCls: StorageEngine, options) {
    this._strategy = new strategyCls(options);
  }
  get(key) {
    return this._strategy.get(key);
  }
  getJson(key) {
    try {
      return JSON.parse(this._strategy.get(key));
    } catch(e) {
      console.warn('Storage getJson(): unable to parse value for key', key,' as JSON')
      return null;
    }
  }
  set(key, value) {
    return this._strategy.set(key, value);
  }
  remove(key) {
    return this._strategy.remove(key);
  }
  query(query) {
    return this._strategy.query(key);
  }
}

export class StorageEngine {
  get(key, value) {
    throw Error("get() not implemented for this storage engine");
  }
  set(key, value) {
    throw Error("set() not implemented for this storage engine");
  }
  remove(key) {
    throw Error("remove() not implemented for this storage engine");
  }
  query(query) {
    throw Error("query() not implemented for this storage engine");
  }
}
