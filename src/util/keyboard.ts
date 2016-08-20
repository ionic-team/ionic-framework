import { Injectable, NgZone } from '@angular/core';

import { Config } from '../config/config';
import { Form } from './form';
import { hasFocusedTextInput, nativeRaf, zoneRafFrames, nativeTimeout } from './dom';
import { Key } from './key';

/**
 * @name Keyboard
 * @description
 * The `Keyboard` class allows you to work with the keyboard events provided by the Ionic keyboard plugin.
 *
 * @usage
 * ```ts
 * export class MyClass{
 *  constructor(keyboard: Keyboard){
 *    this.keyboard = keyboard;
 *  }
 * }
 *
 * ```
 */

@Injectable()
export class Keyboard {

  constructor(config: Config, private _form: Form, private _zone: NgZone) {
    _zone.runOutsideAngular(() => {
      this.focusOutline(config.get('focusOutline'), document);
    });
  }


/**
 * Check to see if the keyboard is open or not.
 *
 * ```ts
 * export class MyClass{
 *  constructor(keyboard: Keyboard){
 *    this.keyboard = keyboard;
 *  }
 *  keyboardCheck(){
 *    setTimeout(()  => console.log('is the keyboard open ', this.keyboard.isOpen()));
 *  }
 * }
 *
 * ```
 *
 * @return {boolean} returns a true or flase value if the keyboard is open or not
 */
  isOpen() {
    return hasFocusedTextInput();
  }

/**
 * When the keyboard is closed, call any methods you want
 *
 * ```ts
 * export class MyClass{
 *  constructor(keyboard: Keyboard){
 *    this.keyboard = keyboard;
 *    this.keyboard.onClose(this.closeCallback);
 *  }
 *  closeCallback(){
 *     // call what ever functionality you want on keyboard close
 *     console.log('Closing time');
 *  }
 * }
 *
 * ```
 * @param {function} callback method you want to call when the keyboard has been closed
 * @return {function} returns a callback that gets fired when the keyboard is closed
 */
  onClose(callback: Function, pollingInternval = KEYBOARD_CLOSE_POLLING, pollingChecksMax = KEYBOARD_POLLING_CHECKS_MAX) {
    console.debug('keyboard onClose');
    const self = this;
    let checks = 0;

    let promise: Promise<any> = null;

    if (!callback) {
      // a callback wasn't provided, so let's return a promise instead
      promise = new Promise(resolve => { callback = resolve; });
    }

    function checkKeyboard() {
      console.debug('keyboard isOpen', self.isOpen());
      if (!self.isOpen() || checks > pollingChecksMax) {
        zoneRafFrames(30, () => {
          console.debug('keyboard closed');
          callback();
        });

      } else {
        nativeTimeout(checkKeyboard, pollingInternval);
      }
      checks++;
    }

    nativeTimeout(checkKeyboard, pollingInternval);

    return promise;
  }

/**
 * Programmatically close the keyboard
 *
 */
  close() {
    console.debug('keyboard close()');
    nativeRaf(() => {
      if (hasFocusedTextInput()) {
        // only focus out when a text input has focus
        this._form.focusOut();
      }
    });
  }

/**
 * @private
 */
  focusOutline(setting: any, document: any) {
    /* Focus Outline
     * --------------------------------------------------
     * By default, when a keydown event happens from a tab key, then
     * the 'focus-outline' css class is added to the body element
     * so focusable elements have an outline. On a mousedown or
     * touchstart event, then the 'focus-outline' css class is removed.
     *
     * Config default overrides:
     * focusOutline: true     - Always add the focus-outline
     * focusOutline: false    - Do not add the focus-outline
     */

    let self = this;
    let isKeyInputEnabled = false;

    function cssClass() {
      nativeRaf(() => {
        document.body.classList[isKeyInputEnabled ? 'add' : 'remove']('focus-outline');
      });
    }

    if (setting === true) {
      isKeyInputEnabled = true;
      return cssClass();

    } else if (setting === false) {
      return;
    }

    // default is to add the focus-outline when the tab key is used
    function keyDown(ev: KeyboardEvent) {
      if (!isKeyInputEnabled && ev.keyCode === Key.TAB) {
        isKeyInputEnabled = true;
        enableKeyInput();
      }
    }

    function pointerDown() {
      isKeyInputEnabled = false;
      enableKeyInput();
    }

    function enableKeyInput() {
      cssClass();

      self._zone.runOutsideAngular(() => {
        document.removeEventListener('mousedown', pointerDown);
        document.removeEventListener('touchstart', pointerDown);

        if (isKeyInputEnabled) {
          document.addEventListener('mousedown', pointerDown);
          document.addEventListener('touchstart', pointerDown);
        }
      });
    }

    document.addEventListener('keydown', keyDown);
  }

}

const KEYBOARD_CLOSE_POLLING = 150;
const KEYBOARD_POLLING_CHECKS_MAX = 100;
