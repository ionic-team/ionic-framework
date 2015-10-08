import {Injectable, NgZone} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {raf} from '../../util/dom';

/**
 * The Input component is used to focus text input elements.
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
 @Injectable()
export class IonicForm {

  constructor(config: IonicConfig, zone: NgZone) {
    this._config = config;
    this._zone = zone;

    this._inputs = [];
    this._ids = -1;
    this._focused = null;

    zone.runOutsideAngular(() => {
      if (this._config.get('keyboardScrollAssist')) {
        this.initHolders(document);
      }

      if (this._config.get('keyboardInputListener') !== false) {
        this.initKeyInput(document);
      }
    });

  }

  initKeyInput(document) {
    /* Focus Outline
     * --------------------------------------------------
     * When a keydown event happens, from a tab key, then the
     * 'key-input' class is added to the body element so focusable
     * elements have an outline. On a mousedown or touchstart
     * event then the 'key-input' class is removed.
     */

    let isKeyInputEnabled = false;

    function keyDown(ev) {
      if (!isKeyInputEnabled && ev.keyCode == 9) {
        isKeyInputEnabled = true;
        raf(enableKeyInput);
      }
    }

    function pointerDown() {
      isKeyInputEnabled = false;
      raf(enableKeyInput);
    }


    function enableKeyInput() {
      document.body.classList[isKeyInputEnabled ? 'add' : 'remove']('key-input');

      document.removeEventListener('mousedown', pointerDown);
      document.removeEventListener('touchstart', pointerDown);

      if (isKeyInputEnabled) {
        document.addEventListener('mousedown', pointerDown);
        document.addEventListener('touchstart', pointerDown);
      }
    }

    document.addEventListener('keydown', keyDown);
  }

  initHolders(document) {
    // raw DOM fun
    this._holder = document.createElement('focus-holder');

    this._prev = document.createElement('input');
    this._prev.tabIndex = NO_FOCUS_TAB_INDEX;
    this._holder.appendChild(this._prev);

    this._next = document.createElement('input');
    this._next.tabIndex = NO_FOCUS_TAB_INDEX;
    this._holder.appendChild(this._next);

    this._temp = document.createElement('input');
    this._temp.tabIndex = NO_FOCUS_TAB_INDEX;
    this._holder.appendChild(this._temp);

    document.body.appendChild(this._holder);

    function preventDefault(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    this._prev.addEventListener('keydown', preventDefault);
    this._next.addEventListener('keydown', preventDefault);
    this._temp.addEventListener('keydown', preventDefault);

    this._prev.addEventListener('focus', () => {
      this.focusPrevious();
    });

    this._next.addEventListener('focus', () => {
      this.focusNext();
    });

    let self = this;
    let resetTimer;
    function queueReset() {
      clearTimeout(resetTimer);

      resetTimer = setTimeout(function() {
        self._zone.run(() => {
          self.resetInputs();
        });
      }, 100);
    }

    document.addEventListener('focusin', queueReset);
    document.addEventListener('focusout', queueReset);
  }

  setFocusHolder(type) {
    if (this._temp) {
      this._temp.tabIndex = TEMP_TAB_INDEX;

      this._temp.type = type || 'text';
      console.debug('setFocusHolder', this._temp.type);
      this._temp.focus();
    }
  }

  /**
   * @param {TODO} input  TODO
   */
  register(input) {
    console.debug('register input', input);

    input.inputId = ++this._ids;
    input.tabIndex = NORMAL_FOCUS_TAB_INDEX;
    this._inputs.push(input);
  }

  deregister(input) {
    console.debug('deregister input', input);

    let index = this._inputs.indexOf(input);
    if (index > -1) {
      this._inputs.splice(index, 1);
    }
    if (input === this._focused) {
      this._focused = null;
    }
  }

  resetInputs() {
    this._focused = null;

    for (let i = 0, ii = this._inputs.length; i < ii; i++) {
      if (!this._focused && this._inputs[i].hasFocus) {
        this._focused = this._inputs[i];
        this._focused.tabIndex = ACTIVE_FOCUS_TAB_INDEX;

      } else {
        this._inputs[i].tabIndex = NORMAL_FOCUS_TAB_INDEX;
      }
    }

    if (this._temp) {
      this._temp.tabIndex = NO_FOCUS_TAB_INDEX;

      if (this._focused) {
        // there's a focused input
        this._prev.tabIndex = PREV_TAB_INDEX;
        this._next.tabIndex = NEXT_TAB_INDEX;

      } else {
        this._prev.tabIndex = this._next.tabIndex = NO_FOCUS_TAB_INDEX;
      }
    }

  }

  /**
   * Focuses the previous input element, if it exists.
   */
  focusPrevious() {
    console.debug('focusPrevious');
    this.focusMove(-1);
  }

  /**
   * Focuses the next input element, if it exists.
   */
  focusNext() {
    console.debug('focusNext');
    this.focusMove(1);
  }

  /**
   * @param {Number} inc TODO
   */
  focusMove(inc) {
    let input = this._focused;
    if (input) {
      let index = this._inputs.indexOf(input);
      if (index > -1 && (index + inc) < this._inputs.length) {
        let siblingInput = this._inputs[index + inc];
        if (siblingInput) {
          siblingInput.initFocus();
          return;
        }
      }
      this._focused.initFocus();
    }
  }

}

const NO_FOCUS_TAB_INDEX = -1;
const NORMAL_FOCUS_TAB_INDEX = 0;
const PREV_TAB_INDEX = 999;
const ACTIVE_FOCUS_TAB_INDEX = 1000;
const NEXT_TAB_INDEX = 1001;
const TEMP_TAB_INDEX = 2000;

