import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { isPresent, isTrueProperty } from '../../util/util';
/**
 * \@name Option
 * \@description
 * `ion-option` is a child component of `ion-select`. Similar to the native option element, `ion-option` can take a value and a selected property.
 *
 * \@demo /docs/demos/src/select/
 */
var Option = (function () {
    /**
     * @param {?} _elementRef
     */
    function Option(_elementRef) {
        this._elementRef = _elementRef;
        this._selected = false;
        this._disabled = false;
        /**
         * \@output {any} Event to evaluate when option is selected.
         */
        this.ionSelect = new EventEmitter();
    }
    Object.defineProperty(Option.prototype, "disabled", {
        /**
         * \@input {boolean} If true, the user cannot interact with this element.
         * @return {?}
         */
        get: function () {
            return this._disabled;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._disabled = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Option.prototype, "selected", {
        /**
         * \@input {boolean} If true, the element is selected.
         * @return {?}
         */
        get: function () {
            return this._selected;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._selected = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Option.prototype, "value", {
        /**
         * \@input {any} The value of the option.
         * @return {?}
         */
        get: function () {
            if (isPresent(this._value)) {
                return this._value;
            }
            return this.text;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._value = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Option.prototype, "text", {
        /**
         * @hidden
         * @return {?}
         */
        get: function () {
            return this._elementRef.nativeElement.textContent;
        },
        enumerable: true,
        configurable: true
    });
    return Option;
}());
export { Option };
Option.decorators = [
    { type: Directive, args: [{
                selector: 'ion-option'
            },] },
];
/**
 * @nocollapse
 */
Option.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
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