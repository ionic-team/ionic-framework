import {Injectable} from '@angular/core';


/**
 * @private
 */
@Injectable()
export class Form {
  private _blur: HTMLElement;
  private _focused: any = null;
  private _ids: number = -1;
  private _inputs: any[] = [];

  constructor() {
    this.focusCtrl(document);
  }

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

  focusCtrl(document: any) {
    // raw DOM fun
    let focusCtrl = document.createElement('focus-ctrl');
    focusCtrl.setAttribute('aria-hidden', true);

    this._blur = document.createElement('button');
    this._blur.tabIndex = -1;
    focusCtrl.appendChild(this._blur);

    document.body.appendChild(focusCtrl);
  }

  focusOut() {
    console.debug('focusOut');
    let activeElement: any = document.activeElement;
    if (activeElement) {
      activeElement.blur();
    }
    this._blur.focus();
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
