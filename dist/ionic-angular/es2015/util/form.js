import { Injectable } from '@angular/core';
import { removeArrayItem } from './util';
/**
 * @hidden
 */
export class Form {
    constructor() {
        this._focused = null;
        this._ids = -1;
        this._inputs = [];
    }
    /**
     * @param {?} input
     * @return {?}
     */
    register(input) {
        this._inputs.push(input);
    }
    /**
     * @param {?} input
     * @return {?}
     */
    deregister(input) {
        removeArrayItem(this._inputs, input);
        this.unsetAsFocused(input);
    }
    /**
     * @param {?} input
     * @return {?}
     */
    setAsFocused(input) {
        this._focused = input;
    }
    /**
     * @param {?} input
     * @return {?}
     */
    unsetAsFocused(input) {
        if (input === this._focused) {
            this._focused = null;
        }
    }
    /**
     * Focuses the next input element, if it exists.
     * @param {?} currentInput
     * @return {?}
     */
    tabFocus(currentInput) {
        const /** @type {?} */ inputs = this._inputs;
        let /** @type {?} */ index = inputs.indexOf(currentInput) + 1;
        if (index > 0 && index < inputs.length) {
            var /** @type {?} */ nextInput = inputs[index];
            if (nextInput !== this._focused) {
                (void 0) /* console.debug */;
                return nextInput.initFocus();
            }
        }
        index = inputs.indexOf(this._focused);
        if (index > 0) {
            var /** @type {?} */ previousInput = inputs[index - 1];
            if (previousInput) {
                (void 0) /* console.debug */;
                previousInput.initFocus();
            }
        }
    }
    /**
     * @return {?}
     */
    nextId() {
        return ++this._ids;
    }
}
Form.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
Form.ctorParameters = () => [];
function Form_tsickle_Closure_declarations() {
    /** @type {?} */
    Form.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Form.ctorParameters;
    /** @type {?} */
    Form.prototype._focused;
    /** @type {?} */
    Form.prototype._ids;
    /** @type {?} */
    Form.prototype._inputs;
}
/**
 * @hidden
 * @abstract
 */
export class IonicTapInput {
    /**
     * @abstract
     * @return {?}
     */
    initFocus() { }
    /**
     * @abstract
     * @return {?}
     */
    checked() { }
    /**
     * @abstract
     * @param {?} val
     * @return {?}
     */
    checked(val) { }
    /**
     * @abstract
     * @return {?}
     */
    disabled() { }
    /**
     * @abstract
     * @param {?} val
     * @return {?}
     */
    disabled(val) { }
}
/**
 * @hidden
 * @abstract
 */
export class IonicFormInput {
    /**
     * @abstract
     * @return {?}
     */
    initFocus() { }
}
//# sourceMappingURL=form.js.map