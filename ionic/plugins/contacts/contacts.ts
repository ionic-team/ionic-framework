// install   :     cordova plugin add cordova-plugin-contacts
// link      :     https://github.com/apache/cordova-plugin-contacts
import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

@NativePlugin({
  name: 'Contacts',
  platforms: ['ios', 'android'],
  engines: {
    cordova: 'cordova-plugin-contacts'
  }
})
export class Contacts {
  static save(contact) {
    return new Promise((resolve, reject) => {
      if(!navigator.contacts) {
        this.pluginWarn();
        reject('Contacts plugin not installed');
      }
      var deviceContact = navigator.contacts.create(contact);

      deviceContact.save(function (result) {
        resolve(result);
      }, function (err) {
        reject(err);
      });
    });
  }

  static remove(contact) {
    return new Promise((resolve, reject) => {
      if(!navigator.contacts) {
        this.pluginWarn();
        reject('Contacts plugin not installed');
      }
      var deviceContact = navigator.contacts.create(contact);

      deviceContact.remove(function (result) {
        resolve(result);
      }, function (err) {
        reject(err);
      });
    })
  }

  static clone(contact) {
    if(!navigator.contacts) {
      this.pluginWarn();
      return null;
    }
    var deviceContact = navigator.contacts.create(contact);
    return deviceContact.clone(contact);
  }

  static find(options) {
    return new Promise((resolve, reject) => {
      var fields = options.fields || ['id', 'displayName'];
      delete options.fields;
      if (Object.keys(options).length === 0) {
        navigator.contacts.find(fields, function (results) {
          resolve(results);
        },function (err) {
          reject(err);
        });
      } else {
        navigator.contacts.find(fields, function (results) {
          resolve(results);
        }, function (err) {
          reject(err);
        }, options);
      }
    });
  }

  static pickContact() {
    return new Promise((resolve, reject) => {
      navigator.contacts.pickContact(function (contact) {
        resolve(contact);
      }, function (err) {
        reject(err);
      });
    })
  }

  // TODO: method to set / get ContactAddress
  // TODO: method to set / get ContactError
  // TODO: method to set / get ContactField
  // TODO: method to set / get ContactName
  // TODO: method to set / get ContactOrganization
}
