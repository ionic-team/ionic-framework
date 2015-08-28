import {Directive, ElementRef, Query, QueryList} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';


let inputRegistry = [];
let inputItemIds = -1;
let activeInput = null;
let lastInput = null;

/**
 * TODO
 */
export class IonInput extends Ion {
  /**
   * TODO
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
   * TODO
   */
  static focusPrevious() {
    this.focusMove(-1);
  }

  /**
   * TODO
   */
  static focusNext() {
    this.focusMove(1);
  }

  /**
   * TODO
   * @param {TODO} inc  TODO
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
   * TODO
   * @returns {TODO} TODO
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
