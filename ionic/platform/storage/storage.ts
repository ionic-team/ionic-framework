/**
 * Storage is an easy way to store key/value pairs and other complicated
 * data in a way that uses a variety of storage engines underneath.
 *
 * For most cases, we recommend the SqlStorage system as it will store
 * data in a file in the app's sandbox. LocalStorage should ONLY be used
 * for temporary data as it may be "cleaned up" by the operation system
 * during low disk space situations.
 */
/**
 * @private
*/
export class Storage {
  private _strategy: any;

  constructor(strategyCls: any, options) {
    this._strategy = new strategyCls(options);
  }
  get(key: string): Promise<string> {
    return this._strategy.get(key);
  }
  getJson(key: string): Promise<any> {
    try {
      return JSON.parse(this._strategy.get(key));
    } catch(e) {
      console.warn('Storage getJson(): unable to parse value for key', key,' as JSON')
      return null;
    }
  }
  set(key: string, value: string): Promise<any> {
    return this._strategy.set(key, value);
  }
  remove(key: string): Promise<any> {
    return this._strategy.remove(key);
  }
  query(query: string, params?: any[]): Promise<any> {
    return this._strategy.query(query, params);
  }
}

/**
 * @private
*/
export class StorageEngine {
  get(key: string) {
    throw Error("get() not implemented for this storage engine");
  }
  set(key: string, value: string) {
    throw Error("set() not implemented for this storage engine");
  }
  remove(key: string) {
    throw Error("remove() not implemented for this storage engine");
  }
  query(query: string, params?: any[]) {
    throw Error("query() not implemented for this storage engine");
  }
}
