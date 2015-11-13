import {Injectable, NgZone} from 'angular2/angular2';

import {Config} from '../config/config';
import {Form} from './form';
import * as dom from './dom';


@Injectable()
export class Keyboard {

  constructor(config: Config, form: Form, zone: NgZone) {
    this.form = form;
    this.zone = zone;

    zone.runOutsideAngular(() => {
      this.focusOutline(config.get('focusOutline'), document);
    });
  }

  isOpen() {
    return dom.hasFocusedTextInput();
  }

  onClose(callback) {
    const self = this;

    let promise = null;

    if (!callback) {
      // a callback wasn't provided, so let's return a promise instead
      promise = new Promise(resolve => { callback = resolve; });
    }

    self.zone.runOutsideAngular(() => {

      function checkKeyboard() {
        if (!self.isOpen()) {
          self.zone.run(() => {
            console.debug('keyboard closed');
            callback();
          });

        } else {
          setTimeout(checkKeyboard, KEYBOARD_CLOSE_POLLING);
        }
      }

      setTimeout(checkKeyboard, KEYBOARD_CLOSE_POLLING);

    });

    return promise;
  }

  close() {
    dom.raf(() => {
      if (dom.hasFocusedTextInput()) {
        // only focus out when a text input has focus
        this.form.focusOut();
      }
    });
  }

  focusOutline(setting, document) {
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
      dom.raf(() => {
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
    function keyDown(ev) {
      if (!isKeyInputEnabled && ev.keyCode == 9) {
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

      self.zone.runOutsideAngular(() => {
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
