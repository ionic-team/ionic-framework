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
  constructor(strategyCls: StorageEngine) {
    this._strategy = new strategyCls();
  }
  get(key) {
    return this._strategy.get(key);
  }
  set(key, value) {
    return this._strategy.set(key, value);
  }
  remove(key) {
    return this._strategy.remove(key);
  }
}

export class StorageEngine {
  get(key, value) {
    throw Error("Not implemented");
  }
  set(key, value) {
    throw Error("Not implemented");
  }
  remove(key) {
    throw Error("Not implemented");
  }
}
