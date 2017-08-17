import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { isPresent, isTrueProperty } from '../../util/util';
/**
 * \@name Option
 * \@description
 * `ion-option` is a child component of `ion-select`. Similar to the native option element, `ion-option` can take a value and a selected property.
 *
 * \@demo /docs/demos/src/select/
 */
export class Option {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
        this._selected = false;
        this._disabled = false;
        /**
         * \@output {any} Event to evaluate when option is selected.
         */
        this.ionSelect = new EventEmitter();
    }
    /**
     * \@input {boolean} If true, the user cannot interact with this element.
     * @return {?}
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set disabled(val) {
        this._disabled = isTrueProperty(val);
    }
    /**
     * \@input {boolean} If true, the element is selected.
     * @return {?}
     */
    get selected() {
        return this._selected;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set selected(val) {
        this._selected = isTrueProperty(val);
    }
    /**
     * \@input {any} The value of the option.
     * @return {?}
     */
    get value() {
        if (isPresent(this._value)) {
            return this._value;
        }
        return this.text;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set value(val) {
        this._value = val;
    }
    /**
     * @hidden
     * @return {?}
     */
    get text() {
        return this._elementRef.nativeElement.textContent;
    }
}
Option.decorators = [
    { type: Directive, args: [{
                selector: 'ion-option'
            },] },
];
/**
 * @nocollapse
 */
Option.ctorParameters = () => [
    { type: ElementRef, },
];
Option.propDecorators = {
    'disabled': [{ type: Input },],
    'selected': [{ type: Input },],
    'value': [{ type: Input },],
    'ionSelect': [{ type: Output },],
};
function Option_tsickle_Closure_declarations() {
    /** @type {?} */
    Option.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Option.ctorParameters;
    /** @type {?} */
    Option.propDecorators;
    /** @type {?} */
    Option.prototype._selected;
    /** @type {?} */
    Option.prototype._disabled;
    /** @type {?} */
    Option.prototype._value;
    /**
     * \@output {any} Event to evaluate when option is selected.
     * @type {?}
     */
    Option.prototype.ionSelect;
    /** @type {?} */
    Option.prototype._elementRef;
}
//# sourceMappingURL=option.js.map