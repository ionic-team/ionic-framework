/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { focusOutActiveElement, getDocument, getWindow, hasFocusedTextInput } from './chunk1.js';

const KEY_TAB = 9;

let v2KeyboardWillShowHandler = null;
let v2KeyboardWillHideHandler = null;
let v2KeyboardDidShowHandler = null;
let v2KeyboardDidHideHandler = null;
let v1keyboardHide = null;
let v1keyboardShow = null;
let timeoutValue = null;
class KeyboardController {
    componentDidLoad() {
        componentDidLoadImpl(this);
    }
    isOpen() {
        return hasFocusedTextInput();
    }
    onClose(callback, pollingInterval = KEYBOARD_CLOSE_POLLING, maxPollingChecks = KEYBOARD_POLLING_CHECKS_MAX) {
        return onCloseImpl(this, callback, pollingInterval, maxPollingChecks);
    }
    static get is() { return "ion-keyboard-controller"; }
    static get properties() { return { "config": { "context": "config" } }; }
    static get events() { return [{ "name": "keyboardWillShow", "method": "keyboardWillShow", "bubbles": true, "cancelable": true, "composed": true }, { "name": "keyboardDidShow", "method": "keyboardDidShow", "bubbles": true, "cancelable": true, "composed": true }, { "name": "keyboardWillHide", "method": "keyboardWillHide", "bubbles": true, "cancelable": true, "composed": true }, { "name": "keyboardDidHide", "method": "keyboardDidHide", "bubbles": true, "cancelable": true, "composed": true }]; }
}
function onCloseImpl(keyboardController, callback, pollingInterval, maxPollingChecks) {
    let numChecks = 0;
    const promise = callback ? null : new Promise((resolve) => {
        callback = resolve;
    });
    const checkKeyBoard = () => {
        if (!keyboardController.isOpen() || numChecks > maxPollingChecks) {
            setTimeout(() => {
                callback();
            }, 400);
        }
        else {
            setTimeout(checkKeyBoard, pollingInterval);
        }
        numChecks++;
    };
    setTimeout(checkKeyBoard, pollingInterval);
    return promise;
}
function componentDidLoadImpl(keyboardController) {
    focusOutline(getDocument(), keyboardController.config.get('focusOutline'));
    if (keyboardController.config.getBoolean('keyboardResizes', false)) {
        listenV2(getWindow(), keyboardController);
    }
    else {
        listenV1(getWindow(), keyboardController);
    }
}
function listenV2(win, keyboardController) {
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
function listenV1(win, keyboardController) {
    v1keyboardHide = () => {
        blurActiveInput(true, keyboardController);
    };
    win.addEventListener('native.keyboardhide', v1keyboardHide);
    v1keyboardShow = () => {
        blurActiveInput(false, keyboardController);
    };
    win.addEventListener('native.keyboardshow', v1keyboardShow);
}
function blurActiveInput(shouldBlur, keyboardController) {
    clearTimeout(timeoutValue);
    if (shouldBlur) {
        timeoutValue = setTimeout(() => {
            if (keyboardController.isOpen()) {
                focusOutActiveElement();
            }
        }, 80);
    }
}
function focusOutline(doc, value) {
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
    }
    else if (value === false) {
        return;
    }
    const keyDownHandler = (event) => {
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

export { KeyboardController as IonKeyboardController };
