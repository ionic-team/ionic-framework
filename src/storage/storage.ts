/**
 * Storage is an easy way to store key/value pairs and other complicated
 * data in a way that uses a variety of storage engines underneath.
 *
 * For most cases, we recommend the SqlStorage system as it will store
 * data in a file in the app's sandbox. LocalStorage should ONLY be used
 * for temporary data as it may be 'cleaned up' by the operation system
 * during low disk space situations.
 */
/**
 * @private
*/
export class Storage {
  private _strategy: StorageEngine;

  constructor(strategyCls: IStorageEngine, options?: any) {
    this._strategy = new strategyCls(options);
  }

  get(key: string): Promise<any> {
    return this._strategy.get(key);
  }

  getJson(key: string): Promise<any> {
    return this.get(key).then(value => {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.warn('Storage getJson(): unable to parse value for key', key, ' as JSON');
        throw e; // rethrowing exception so it can be handled with .catch()
      }
    });
  }

  setJson(key: string, value: any): Promise<any> {
    try {
      return this.set(key, JSON.stringify(value));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  set(key: string, value: any) {
    return this._strategy.set(key, value);
  }

  remove(key: string) {
    return this._strategy.remove(key);
  }

  query(query: string, params?: any) {
    return this._strategy.query(query, params);
  }

  clear() {
    return this._strategy.clear();
  }
}

export interface IStorageEngine {
  new (options: any): StorageEngine;
}

/**
 * @private
*/
export class StorageEngine {
  constructor(options = {}) { }

  get(key: string): Promise<any> {
    throw Error('get() not implemented for this storage engine');
  }
  set(key: string, value: any): Promise<any> {
    throw Error('set() not implemented for this storage engine');
  }
  remove(key: string): Promise<any> {
    throw Error('remove() not implemented for this storage engine');
  }
  query(query: string, params?: any): Promise<any> {
    throw Error('query() not implemented for this storage engine');
  }
  clear(): Promise<any> {
    throw Error('clear() not implemented for this storage engine');
  }
}
