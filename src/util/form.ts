import {Injectable} from '@angular/core';


/**
 * @private
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
    let index = this._inputs.indexOf(input);
    if (index > -1) {
      this._inputs.splice(index, 1);
    }
    if (input === this._focused) {
      this._focused = null;
    }
  }

  focusOut() {
    let activeElement = <HTMLElement>document.activeElement;
    activeElement && activeElement.blur && activeElement.blur();
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
