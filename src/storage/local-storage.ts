import { StorageEngine } from './storage';


/**
 * @name LocalStorage
 * @description
 * The LocalStorage storage engine uses the browser's local storage system for
 * storing key/value pairs.
 *
 * Note: LocalStorage should ONLY be used for temporary data that you can afford to lose.
 * Given disk space constraints on a mobile device, local storage might be "cleaned up"
 * by the operating system (iOS).
 *
 * For guaranteed, long-term storage, use the SqlStorage engine which stores data in a file.
 *
 * @usage
 * ```ts
 * import { Component } from '@angular/core';
 * import { Storage, LocalStorage } from 'ionic-angular';
 * @Component({
 *   template: `<ion-content></ion-content>`
 * });
 * export class MyClass{
 *  constructor(){
 *    this.local = new Storage(LocalStorage);
 *    this.local.set('didTutorial', 'true');
 *  }
 *}
 *```
 * @demo /docs/v2/demos/src/local-storage/
 * @see {@link /docs/v2/platform/storage/ Storage Platform Docs}
 */
export class LocalStorage extends StorageEngine {
  constructor(options = {}) {
    super();
  }

  /**
   * Get the value of a key in LocalStorage
   * @param {string} key the key you want to lookup in LocalStorage
   * @returns {Promise} Returns a promise which is resolved when the value has been retrieved
   */
  get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        let value = window.localStorage.getItem(key);
        resolve(value);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Set a key value pair and save it to LocalStorage
   * @param {string} key the key you want to save to LocalStorage
   * @param {string} value the value of the key you're saving
   * @returns {Promise} Returns a promise which is resolved when the key value pair have been set
   */
  set(key: string, value: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.setItem(key, value);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Remove a key from LocalStorage
   * @param {string} key the key you want to remove from LocalStorage
   * @returns {Promise} Returns a promise which is resolved when the key has been removed
   */
  remove(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.removeItem(key);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Clear data stored in LocalStorage
   * @returns {Promise} Returns a promise which is resolved when the data have been cleared
   */
  clear(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.clear();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
