(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("./util");
    /**
     * @hidden
     */
    var Form = (function () {
        function Form() {
            this._focused = null;
            this._ids = -1;
            this._inputs = [];
        }
        /**
         * @param {?} input
         * @return {?}
         */
        Form.prototype.register = function (input) {
            this._inputs.push(input);
        };
        /**
         * @param {?} input
         * @return {?}
         */
        Form.prototype.deregister = function (input) {
            util_1.removeArrayItem(this._inputs, input);
            this.unsetAsFocused(input);
        };
        /**
         * @param {?} input
         * @return {?}
         */
        Form.prototype.setAsFocused = function (input) {
            this._focused = input;
        };
        /**
         * @param {?} input
         * @return {?}
         */
        Form.prototype.unsetAsFocused = function (input) {
            if (input === this._focused) {
                this._focused = null;
            }
        };
        /**
         * Focuses the next input element, if it exists.
         * @param {?} currentInput
         * @return {?}
         */
        Form.prototype.tabFocus = function (currentInput) {
            var /** @type {?} */ inputs = this._inputs;
            var /** @type {?} */ index = inputs.indexOf(currentInput) + 1;
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
        };
        /**
         * @return {?}
         */
        Form.prototype.nextId = function () {
            return ++this._ids;
        };
        return Form;
    }());
    Form.decorators = [
        { type: core_1.Injectable },
    ];
    /**
     * @nocollapse
     */
    Form.ctorParameters = function () { return []; };
    exports.Form = Form;
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
    var IonicTapInput = (function () {
        function IonicTapInput() {
        }
        /**
         * @abstract
         * @return {?}
         */
        IonicTapInput.prototype.initFocus = function () { };
        /**
         * @abstract
         * @return {?}
         */
        IonicTapInput.prototype.checked = function () { };
        /**
         * @abstract
         * @param {?} val
         * @return {?}
         */
        IonicTapInput.prototype.checked = function (val) { };
        /**
         * @abstract
         * @return {?}
         */
        IonicTapInput.prototype.disabled = function () { };
        /**
         * @abstract
         * @param {?} val
         * @return {?}
         */
        IonicTapInput.prototype.disabled = function (val) { };
        return IonicTapInput;
    }());
    exports.IonicTapInput = IonicTapInput;
    /**
     * @hidden
     * @abstract
     */
    var IonicFormInput = (function () {
        function IonicFormInput() {
        }
        /**
         * @abstract
         * @return {?}
         */
        IonicFormInput.prototype.initFocus = function () { };
        return IonicFormInput;
    }());
    exports.IonicFormInput = IonicFormInput;
});
//# sourceMappingURL=form.js.map