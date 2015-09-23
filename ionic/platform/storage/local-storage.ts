import {StorageEngine} from './storage';


/**
 * The LocalStorage storage engine uses the browser's local storage system for
 * storing key/value pairs.
 *
 * Note: LocalStorage should ONLY be used for temporary data that you can afford to lose.
 * Given disk space constraints on a mobile device, local storage might be "cleaned up"
 * by the operating system (iOS).
 *
 * For guaranteed, long-term storage, use the SqlStorage engine which stores data in a file.
 */
export class LocalStorage extends StorageEngine {
  constructor() {
    super();
  }
  get(key) {
    return new Promise((resolve, reject) => {
      try {
        let value = window.localStorage.getItem(key);
        resolve(value);
      } catch(e) {
        reject(e);
      }
    });
  }
  set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.setItem(key, value);
        resolve();
      } catch(e) {
        reject(e);
      }
    });
  }
  remove(key) {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.removeItem(key);
        resolve();
      } catch(e) {
        reject(e);
      }
    });
  }
}
