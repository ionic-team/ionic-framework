import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
 * Access and manage Contacts on the device.
 *
 * Requires plugin: `cordova-plugin-contacts`
 * For full info, please see the [Cordova Contacts Docs](https://github.com/apache/cordova-plugin-contacts)
 *
 * @usage
 *
 * ```js
 * Contacts.save({
 *   displayName: "Mr. Ionitron"
 * }).then((contact) => {}, (err) => {})
 * ```
 *
 * See the `save()` docs for a full list of fields.
 *
 */
@NativePlugin({
  name: 'Contacts',
  platforms: ['ios', 'android'],
  engines: {
    cordova: 'cordova-plugin-contacts'
  }
})
export class Contacts {
  /**
   * Save a contact into the contacts database.
   *
   * Valid fields:
   * {
   * id: A globally unique identifier. (DOMString)
   * displayName: The name of this Contact, suitable for display to end-users. (DOMString)
   * name: An object containing all components of a persons name. (ContactName)
   * nickname: A casual name by which to address the contact. (DOMString)
   * phoneNumbers: An array of all the contact's phone numbers. (ContactField[])
   * emails: An array of all the contact's email addresses. (ContactField[])
   * addresses: An array of all the contact's addresses. (ContactAddress[])
   * ims: An array of all the contact's IM addresses. (ContactField[])
   * organizations: An array of all the contact's organizations. (ContactOrganization[])
   * birthday: The birthday of the contact. (Date)
   * note: A note about the contact. (DOMString)
   * photos: An array of the contact's photos. (ContactField[])
   * categories: An array of all the user-defined categories associated with the contact. (ContactField[])
   * urls: An array of web pages associated with the contact. (ContactField[])
   * }
   *
   * @param contact {object} the contact to save.
   * @return {Promise} that resolves with the created and saved contact
   */
  static save(contact) {
    return new Promise((resolve, reject) => {
      if(!navigator.contacts) {
        this.pluginWarn();
        reject('Contacts plugin not installed');
      }
      var deviceContact = navigator.contacts.create(contact);

      deviceContact.save(function (result) {
        resolve(deviceContact);
      }, function (err) {
        reject(err);
      });
    });
  }


  /*
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
  */

  /**
   * Search for contacts in the Contacts list.
   *
   * Example: Contacts.find({ filter: 'Max' }) // will search for a displayName of 'Max'
   *
   * @param options the options to query with
   *
   * filter: The search string used to find navigator.contacts. (DOMString) (Default: "")
   * multiple: Determines if the find operation returns multiple navigator.contacts. (Boolean) (Default: false)
   * desiredFields: Contact fields to be returned back. If specified, the resulting Contact object only features values for these fields. (DOMString[]) [Optional]
   * hasPhoneNumber(Android only): Filters the search to only return contacts with a phone number informed. (Boolean) (Default: false)
   *
   * @return {Promise} that resolves with the search results
   */
  static find(options) {
    return new Promise((resolve, reject) => {
      var fields = options.fields || ['id', 'displayName'];
      delete options.fields;

      navigator.contacts.find(fields, function (results) {
        resolve(results);
      }, function (err) {
        reject(err);
      }, options || undefined);
    });
  }

  /**
   * Show a native contact picker control.
   *
   * @return {Promise} resolves with the picked contact.
   */
  static pickContact() {
    return new Promise((resolve, reject) => {
      navigator.contacts.pickContact(function (contact) {
        resolve(contact);
      }, function (err) {
        reject(err);
      });
    })
  }
}
