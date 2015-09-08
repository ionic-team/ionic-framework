import {Directive, ElementRef, Query, QueryList} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';


let inputRegistry = [];
let inputItemIds = -1;
let activeInput = null;
let lastInput = null;

/**
 * @name ionInput
 * @description
 * The ionInput component is used to focus text input elements.
 * 
 * The `focusNext()` and  `focusPrevious()` methods make it easy to focus input elements across all devices.
 *
 * @usage
 * ```html
 * <ion-input>
 *   <ion-label>Name</ion-label>
 *   <input value="Name" type="text">
 * </ion-input>
 * ```
 */
export class IonInput extends Ion {
  /**
   * @param {TODO} input  TODO
   */
  static registerInput(input) {
    inputRegistry.push(input);
  }

  /**
   * TODO
   * @param {TODO} input  TODO
   */
  static setAsLastInput(input) {
    lastInput = input;
  }

  /**
   * Focuses the previous input element, if it exists.
   */
  static focusPrevious() {
    this.focusMove(-1);
  }

  /**
   * Focuses the next input element, if it exists.
   */
  static focusNext() {
    this.focusMove(1);
  }

  /**
   * @param {Number} inc TODO
   */
  static focusMove(inc) {
    let input = activeInput || lastInput;
    if (input) {

      let index = inputRegistry.indexOf(input);
      if (index > -1 && (index + inc) < inputRegistry.length) {
        let siblingInput = inputRegistry[index + inc];
        siblingInput && siblingInput.initFocus();
      }
    }
  }

  /**
   * @returns {Number} The ID of the next input element.
   */
  static nextId() {
    return ++inputItemIds;
  }

  /**
   * TODO
   */
  static clearTabIndexes() {
    for (let i = 0; i < inputRegistry.length; i++) {
      inputRegistry[i].tabIndex = -1;
    }
  }

}
