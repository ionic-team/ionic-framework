import { Component, Event, EventEmitter, Prop} from '@stencil/core';
import { Config } from '../..';
import { focusOutActiveElement, getDocument, getWindow, hasFocusedTextInput } from '../../utils/helpers';
import { KEY_TAB } from './keys';

let v2KeyboardWillShowHandler: () => void = null;
let v2KeyboardWillHideHandler: () => void = null;
let v2KeyboardDidShowHandler: () => void = null;
let v2KeyboardDidHideHandler: () => void = null;
let v1keyboardHide: () => void = null;
let v1keyboardShow: () => void = null;
let timeoutValue: number = null;

@Component({
  tag: 'ion-keyboard-controller'
})
export class KeyboardController {

  @Prop({context: 'config'}) config: Config;

  /**
   * Emitted before the keyboard has shown.
   */
  @Event() keyboardWillShow: EventEmitter;

  /**
   * Emitted after the keyboard has shown.
   */
  @Event() keyboardDidShow: EventEmitter;

  /**
   * Emitted before the keyboard has hidden.
   */
  @Event() keyboardWillHide: EventEmitter;

  /**
   * Emitted after the keyboard has hidden.
   */
  @Event() keyboardDidHide: EventEmitter;

  componentDidLoad() {
    componentDidLoadImpl(this);
  }

  isOpen(): boolean {
    return hasFocusedTextInput();
  }

  onClose(callback: Function, pollingInterval: number = KEYBOARD_CLOSE_POLLING, maxPollingChecks: number = KEYBOARD_POLLING_CHECKS_MAX): Promise<any> {

    return onCloseImpl(this, callback, pollingInterval, maxPollingChecks);
  }
}

export function onCloseImpl(keyboardController: KeyboardController, callback: Function, pollingInterval: number, maxPollingChecks: number): Promise<any> {
  let numChecks = 0;

  const promise: Promise<any> = callback ? null : new Promise((resolve) => {
    callback = resolve;
  });

  const checkKeyBoard = () => {
    if (!keyboardController.isOpen() || numChecks > maxPollingChecks) {
      setTimeout(() => {
        callback();
      }, 400);
    } else {
      setTimeout(checkKeyBoard, pollingInterval);
    }
    numChecks++;
  };

  setTimeout(checkKeyBoard, pollingInterval);
  return promise;
}

export function componentDidLoadImpl(keyboardController: KeyboardController) {
  focusOutline(getDocument(), keyboardController.config.get('focusOutline'));
  if (keyboardController.config.getBoolean('keyboardResizes', false)) {
    listenV2(getWindow(), keyboardController);
  } else {
    listenV1(getWindow(), keyboardController);
  }
}

export function listenV2(win: Window, keyboardController: KeyboardController) {
  v2KeyboardWillShowHandler = () => {
    keyboardController.keyboardWillShow.emit();
  };
  win.addEventListener('keyboardWillShow', v2KeyboardWillShowHandler);

  v2KeyboardWillHideHandler = () => {
    keyboardController.keyboardWillHide.emit();
  };
  win.addEventListener('keyboardWillHide', v2KeyboardWillHideHandler);

  v2KeyboardDidShowHandler = () => {
    keyboardController.keyboardDidShow.emit();
  };
  win.addEventListener('keyboardDidShow', v2KeyboardDidShowHandler);

  v2KeyboardDidHideHandler = () => {
    keyboardController.keyboardDidHide.emit();
  };
  win.addEventListener('keyboardDidHide', v2KeyboardDidHideHandler);
}

export function listenV1(win: Window, keyboardController: KeyboardController) {
  v1keyboardHide = () => {
    blurActiveInput(true, keyboardController);
  };
  win.addEventListener('native.keyboardhide', v1keyboardHide);

  v1keyboardShow = () => {
    blurActiveInput(false, keyboardController);
  };
  win.addEventListener('native.keyboardshow', v1keyboardShow);
}

export function blurActiveInput(shouldBlur: boolean, keyboardController: KeyboardController) {
  clearTimeout(timeoutValue);
  if (shouldBlur) {
    timeoutValue = setTimeout(() => {
      if (keyboardController.isOpen()) {
        focusOutActiveElement();
      }
    }, 80) as any as number;
  }
}

export function focusOutline(doc: Document, value: boolean) {
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

  let isKeyInputEnabled = false;

  const cssClass = () => {
    window.requestAnimationFrame(() => {
      doc.body.classList[isKeyInputEnabled ? 'add' : 'remove']('focus-outline');
    });
  };

  if (value === true) {
    isKeyInputEnabled = true;
    return cssClass();
  } else if (value === false) {
    return;
  }

  const keyDownHandler = (event: KeyboardEvent) => {
    if (!isKeyInputEnabled && event.keyCode === KEY_TAB) {
      isKeyInputEnabled = true;
      enableKeyInput();
    }
  };

  const pointerDown = () => {
    isKeyInputEnabled = false;
    enableKeyInput();
  };

  const enableKeyInput = () => {
    cssClass();

    doc.removeEventListener('mousedown', pointerDown);
    doc.removeEventListener('touchstart', pointerDown);

    if (isKeyInputEnabled) {
      doc.addEventListener('mousedown', pointerDown);
      doc.addEventListener('touchstart', pointerDown);
    }
  };

  doc.addEventListener('keydown', keyDownHandler);
}

const KEYBOARD_CLOSE_POLLING = 150;
const KEYBOARD_POLLING_CHECKS_MAX = 100;
