import { Injectable, NgZone } from '@angular/core';

import { Config } from '../config/config';
import { DomController } from './dom-controller';
import { isTextInput } from '../util/dom';
import { KEY_TAB } from './key';
import { Platform } from './platform';


/**
 * @name Keyboard
 * @description
 * The `Keyboard` class allows you to work with the keyboard events provided
 * by the Ionic keyboard plugin.
 *
 * @usage
 * ```ts
 * export class MyClass {
 *   constructor(public keyboard: Keyboard) {
 *
 *   }
 * }
 * ```
 */
@Injectable()
export class Keyboard {
  private _tmr: any;

  constructor(config: Config, private _plt: Platform, private _zone: NgZone, private _dom: DomController) {
    this.focusOutline(config.get('focusOutline'));

    const win = _plt.win();

    _plt.registerListener(win, 'native.keyboardhide', () => {
      _plt.cancelTimeout(this._tmr);
      this._tmr = _plt.timeout(() => {
        // this custom cordova plugin event fires when the keyboard will hide
        // useful when the virtual keyboard is closed natively
        // https://github.com/driftyco/ionic-plugin-keyboard
        if (this.isOpen()) {
          this._plt.focusOutActiveElement();
        }
      }, 80);
    }, { zone: false, passive: true });

    _plt.registerListener(win, 'native.keyboardshow', () => {
      _plt.cancelTimeout(this._tmr);
    }, { zone: false, passive: true });

  }

  /**
   * Check to see if the keyboard is open or not.
   *
   * ```ts
   * export class MyClass {
   *   constructor(public keyboard: Keyboard) {
   *
   *   }
   *
   *   keyboardCheck() {
   *     console.log('The keyboard is open:', this.keyboard.isOpen());
   *   }
   * }
   * ```
   *
   * @return {boolean} returns a true or false value if the keyboard is open or not.
   */
  isOpen() {
    return this.hasFocusedTextInput();
  }

  /**
   * When the keyboard is closed, call any methods you want.
   *
   * ```ts
   * export class MyClass {
   *   constructor(public keyboard: Keyboard) {
   *     this.keyboard.onClose(this.closeCallback);
   *   }
   *   closeCallback() {
   *     // call what ever functionality you want on keyboard close
   *     console.log('Closing time');
   *   }
   * }
   * ```
   *
   * @param {function} callback method you want to call when the keyboard has been closed.
   * @return {function} returns a callback that gets fired when the keyboard is closed.
   */
  onClose(callback: Function, pollingInternval = KEYBOARD_CLOSE_POLLING, pollingChecksMax = KEYBOARD_POLLING_CHECKS_MAX) {
    console.debug(`keyboard, onClose created`);
    const self = this;
    let checks = 0;

    let promise: Promise<any> = null;

    if (!callback) {
      // a callback wasn't provided, so let's return a promise instead
      promise = new Promise(resolve => { callback = resolve; });
    }

    function checkKeyboard() {
      console.debug(`keyboard, isOpen: ${self.isOpen()}`);
      if (!self.isOpen() || checks > pollingChecksMax) {
        self._plt.timeout(function() {
          self._zone.run(function() {
            console.debug(`keyboard, closed`);
            callback();
          });
        }, 400);

      } else {
        self._plt.timeout(checkKeyboard, pollingInternval);
      }
      checks++;
    }

    self._plt.timeout(checkKeyboard, pollingInternval);

    return promise;
  }

  /**
   * Programmatically close the keyboard.
   */
  close() {
    this._dom.read(() => {
      if (this.isOpen()) {
        // only focus out when a text input has focus
        console.debug(`keyboard, close()`);
        this._dom.write(() => {
          this._plt.focusOutActiveElement();
        });
      }
    });
  }

  /**
   * @hidden
   */
  focusOutline(setting: any) {
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

    const self = this;
    const platform = self._plt;
    const doc = platform.doc();
    let isKeyInputEnabled = false;
    let unRegMouse: Function;
    let unRegTouch: Function;
    const evOpts = { passive: true, zone: false };

    function cssClass() {
      self._dom.write(() => {
        (<any>platform.doc().body.classList)[isKeyInputEnabled ? 'add' : 'remove']('focus-outline');
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
      if (!isKeyInputEnabled && ev.keyCode === KEY_TAB) {
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

      unRegMouse && unRegMouse();
      unRegTouch && unRegTouch();

      if (isKeyInputEnabled) {
        // listen for when a mousedown or touchstart event happens
        unRegMouse = platform.registerListener(doc, 'mousedown', pointerDown, evOpts);
        unRegTouch = platform.registerListener(doc, 'touchstart', pointerDown, evOpts);
      }
    }

    // always listen for tab keydown events
    platform.registerListener(platform.doc(), 'keydown', keyDown, evOpts);
  }

  hasFocusedTextInput() {
    const activeEle = this._plt.getActiveElement();
    if (isTextInput(activeEle)) {
      return (activeEle.parentElement.querySelector(':focus') === activeEle);
    }
    return false;
  }

}


const KEYBOARD_CLOSE_POLLING = 150;
const KEYBOARD_POLLING_CHECKS_MAX = 100;
