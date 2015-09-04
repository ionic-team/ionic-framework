import {StorageStrategy} from './storage';

export class LocalStorage extends StorageStrategy {
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
