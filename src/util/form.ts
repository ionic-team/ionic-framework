import { Injectable } from '@angular/core';
import { removeArrayItem } from './util';


/**
 * @hidden
 */
@Injectable()
export class Form {
  private _focused: any = null;
  private _ids: number = -1;
  private _inputs: any[] = [];

  register(input: any) {
    this._inputs.push(input);
  }

  deregister(input: any) {
    removeArrayItem(this._inputs, input);
    if (input === this._focused) {
      this._focused = null;
    }
  }

  setAsFocused(input: any) {
    this._focused = input;
  }

  /**
   * Focuses the next input element, if it exists.
   */
  tabFocus(currentInput: any) {
    let index = this._inputs.indexOf(currentInput);
    if (index > -1 && (index + 1) < this._inputs.length) {
      let nextInput = this._inputs[index + 1];
      if (nextInput !== this._focused) {
        console.debug('tabFocus, next');
        return nextInput.initFocus();
      }
    }

    index = this._inputs.indexOf(this._focused);
    if (index > 0) {
      let previousInput = this._inputs[index - 1];
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
