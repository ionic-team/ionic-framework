import {Directive, ElementRef, Query, QueryList} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';


let inputRegistry = [];
let inputItemIds = -1;
let activeInput = null;
let lastInput = null;


export class IonInput extends Ion {

  static registerInput(input) {
    inputRegistry.push(input);
  }

  static setAsLastInput(input) {
    lastInput = input;
  }

  static focusPrevious() {
    this.focusMove(-1);
  }

  static focusNext() {
    this.focusMove(1);
  }

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

  static nextId() {
    return ++inputItemIds;
  }

  static clearTabIndexes() {
    for (let i = 0; i < inputRegistry.length; i++) {
      inputRegistry[i].tabIndex = -1;
    }
  }

}
