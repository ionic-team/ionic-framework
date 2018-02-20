import { EventEmitter, Injectable, NgZone } from '@angular/core';

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
 *
 *   constructor(public keyboard: Keyboard) { }
 *
 * }
 * ```
 */
@Injectable()
export class Keyboard {

  _tmr: number;

  willShow = new EventEmitter<number>();
  willHide = new EventEmitter<void>();
  didShow = new EventEmitter<number>();
  didHide = new EventEmitter<void>();

  eventsAvailable = false;

  constructor(
    config: Config,
    private _plt: Platform,
    private _zone: NgZone,
    private _dom: DomController
  ) {
    this.focusOutline(config.get('focusOutline'));

    const win = <any>_plt.win();
    if (win.Ionic && win.Ionic.keyboardPlugin) {
      this.listenV2(win);
    } else {
      this.listenV1(win);
    }
  }

  private listenV2(win: any) {
    const platform = this._plt;
    platform.registerListener(win, 'keyboardWillShow', (ev: any) => {
      this._zone.run(() => {
        this.willShow.emit(ev.keyboardHeight);
      });
    }, { zone: false, passive: true });

    platform.registerListener(win, 'keyboardWillHide', () => {
      this._zone.run(() => {
        this.willHide.emit();
      });
    }, { zone: false, passive: true });

    platform.registerListener(win, 'keyboardDidShow', (ev: any) => {
      this._zone.run(() => {
        this.didShow.emit(ev.keyboardHeight);
      });
    }, { zone: false, passive: true });

    platform.registerListener(win, 'keyboardDidHide', () => {
      this._zone.run(() => {
        this.didHide.emit();
      });
    }, { zone: false, passive: true });
    this.eventsAvailable = true;
  }

  private listenV1(win: any) {
    const platform = this._plt;

    platform.registerListener(win, 'native.keyboardhide', () => {
      this.blurActiveInput(true);
    }, { zone: false, passive: true });

    platform.registerListener(win, 'native.keyboardshow', () => {
      this.blurActiveInput(false);
    }, { zone: false, passive: true });
  }

  private blurActiveInput(shouldBlur: boolean) {
    const platform = this._plt;
    platform.cancelTimeout(this._tmr);
    if (shouldBlur) {
      this._tmr = platform.timeout(() => {
        // this custom cordova plugin event fires when the keyboard will hide
        // useful when the virtual keyboard is closed natively
        // https://github.com/ionic-team/ionic-plugin-keyboard
        if (this.isOpen()) {
          platform.focusOutActiveElement();
        }
      }, 80);
    }
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

  /**
   * Set to true to hide the additional toolbar that is on top of the keyboard.
   * This toolbar features the Prev, Next, and Done buttons.
   * @param hidden
   */
  hideFormAccessoryBar(hidden: boolean) {
    const win = this._plt.win() as any;
    if (win && win.Keyboard && win.Keyboard.hideFormAccessoryBar) {
      win.Keyboard.hideFormAccessoryBar(hidden);
    }
  }

}


const KEYBOARD_CLOSE_POLLING = 150;
const KEYBOARD_POLLING_CHECKS_MAX = 100;
