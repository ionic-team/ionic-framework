import { Injectable } from '@angular/core';
import { removeArrayItem } from './util';


/**
 * @hidden
 */
@Injectable()
export class Form {

  private _focused: IonicFormInput = null;
  private _ids: number = -1;
  private _inputs: IonicFormInput[] = [];

  register(input: IonicFormInput) {
    this._inputs.push(input);
  }

  deregister(input: IonicFormInput) {
    removeArrayItem(this._inputs, input);
    this.unsetAsFocused(input);
  }

  setAsFocused(input: IonicFormInput) {
    this._focused = input;
  }

  unsetAsFocused(input: IonicFormInput) {
    if (input === this._focused) {
      this._focused = null;
    }
  }

  /**
   * Focuses the next input element, if it exists.
   */
  tabFocus(currentInput: IonicFormInput) {
    const inputs = this._inputs;
    let index = inputs.indexOf(currentInput) + 1;
    if (index > 0 && index < inputs.length) {
      var nextInput = inputs[index];
      if (nextInput !== this._focused) {
        console.debug('tabFocus, next');
        return nextInput.initFocus();
      }
    }

    index = inputs.indexOf(this._focused);
    if (index > 0) {
      var previousInput = inputs[index - 1];
      if (previousInput) {
        console.debug('tabFocus, previous');
        previousInput.initFocus();
      }
    }
  }

  nextId() {
    return ++this._ids;
  }

}

/**
 * @hidden
 */
export abstract class IonicTapInput implements IonicFormInput {

  abstract initFocus(): void;

  abstract get checked(): boolean;

  abstract set checked(val: boolean);

  abstract get disabled(): boolean;

  abstract set disabled(val: boolean);

}

/**
 * @hidden
 */
export abstract class IonicFormInput {

  abstract initFocus(): void;

}
