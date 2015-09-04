/**
 * Storage is an easy way to store key/value pairs and other complicated
 * data in a way that uses the best possible storage layer underneath.
 */
export class Storage {
  constructor(strategyCls: StorageStrategy) {
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

export class StorageStrategy {
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
