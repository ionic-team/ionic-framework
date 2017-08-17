var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./util", "../components/ion", "./debouncer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("./util");
    var ion_1 = require("../components/ion");
    var debouncer_1 = require("./debouncer");
    var BaseInput = (function (_super) {
        __extends(BaseInput, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} name
         * @param {?} _defaultValue
         * @param {?} _form
         * @param {?} _item
         * @param {?} _ngControl
         */
        function BaseInput(config, elementRef, renderer, name, _defaultValue, _form, _item, _ngControl) {
            var _this = _super.call(this, config, elementRef, renderer, name) || this;
            _this._defaultValue = _defaultValue;
            _this._form = _form;
            _this._item = _item;
            _this._ngControl = _ngControl;
            _this._isFocus = false;
            _this._disabled = false;
            _this._debouncer = new debouncer_1.TimeoutDebouncer(0);
            _this._init = false;
            _this._initModel = false;
            /**
             * \@output {Range} Emitted when the range selector drag starts.
             */
            _this.ionFocus = new core_1.EventEmitter();
            /**
             * \@output {Range} Emitted when the range value changes.
             */
            _this.ionChange = new core_1.EventEmitter();
            /**
             * \@output {Range} Emitted when the range selector drag ends.
             */
            _this.ionBlur = new core_1.EventEmitter();
            _form && _form.register(_this);
            _this._value = util_1.deepCopy(_this._defaultValue);
            if (_item) {
                (void 0) /* assert */;
                _this.id = name + '-' + _item.registerInput(name);
                _this._labelId = _item.labelId;
                _this._item.setElementClass('item-' + name, true);
            }
            // If the user passed a ngControl we need to set the valueAccessor
            if (_ngControl) {
                _ngControl.valueAccessor = _this;
            }
            return _this;
        }
        Object.defineProperty(BaseInput.prototype, "disabled", {
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
                this.setDisabledState(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseInput.prototype, "value", {
            /**
             * @return {?}
             */
            get: function () {
                return this._value;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                if (this._writeValue(val)) {
                    this.onChange();
                    this._fireIonChange();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} val
         * @return {?}
         */
        BaseInput.prototype.setValue = function (val) {
            this.value = val;
        };
        /**
         * @hidden
         * @param {?} isDisabled
         * @return {?}
         */
        BaseInput.prototype.setDisabledState = function (isDisabled) {
            this._disabled = isDisabled = util_1.isTrueProperty(isDisabled);
            this._item && this._item.setElementClass("item-" + this._componentName + "-disabled", isDisabled);
        };
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        BaseInput.prototype.writeValue = function (val) {
            if (this._writeValue(val)) {
                if (this._initModel) {
                    this._fireIonChange();
                }
                else if (this._init) {
                    // ngModel fires the first time too late, we need to skip the first ngModel update
                    this._initModel = true;
                }
            }
        };
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        BaseInput.prototype._writeValue = function (val) {
            (void 0) /* assert */;
            if (util_1.isUndefined(val)) {
                return false;
            }
            var /** @type {?} */ normalized = (val === null)
                ? util_1.deepCopy(this._defaultValue)
                : this._inputNormalize(val);
            var /** @type {?} */ notUpdate = util_1.isUndefined(normalized) || !this._inputShouldChange(normalized);
            if (notUpdate) {
                return false;
            }
            (void 0) /* console.debug */;
            this._value = normalized;
            if (this._init) {
                this._inputUpdated();
            }
            return true;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._fireIonChange = function () {
            var _this = this;
            if (this._init) {
                this._debouncer.debounce(function () {
                    (void 0) /* assert */;
                    _this.ionChange.emit(_this._inputChangeEvent());
                    _this._initModel = true;
                });
            }
        };
        /**
         * @hidden
         * @param {?} fn
         * @return {?}
         */
        BaseInput.prototype.registerOnChange = function (fn) {
            this._onChanged = fn;
        };
        /**
         * @hidden
         * @param {?} fn
         * @return {?}
         */
        BaseInput.prototype.registerOnTouched = function (fn) {
            this._onTouched = fn;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._initialize = function () {
            if (this._init) {
                (void 0) /* assert */;
                return;
            }
            this._init = true;
            if (util_1.isPresent(this._value)) {
                this._inputUpdated();
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._fireFocus = function () {
            if (this._isFocus) {
                return;
            }
            (void 0) /* console.debug */;
            this._form && this._form.setAsFocused(this);
            this._setFocus(true);
            this.ionFocus.emit(this);
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._fireBlur = function () {
            if (!this._isFocus) {
                return;
            }
            (void 0) /* console.debug */;
            this._form && this._form.unsetAsFocused(this);
            this._setFocus(false);
            this.ionBlur.emit(this);
        };
        /**
         * @hidden
         * @param {?} isFocused
         * @return {?}
         */
        BaseInput.prototype._setFocus = function (isFocused) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            (void 0) /* assert */;
            this._isFocus = isFocused;
            var /** @type {?} */ item = this._item;
            if (item) {
                item.setElementClass('input-has-focus', isFocused);
                item.setElementClass('item-input-has-focus', isFocused);
            }
            this._inputUpdated();
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.onChange = function () {
            this._onChanged && this._onChanged(this._inputNgModelEvent());
            this._onTouched && this._onTouched();
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.isFocus = function () {
            return this._isFocus;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.hasValue = function () {
            var /** @type {?} */ val = this._value;
            if (!util_1.isPresent(val)) {
                return false;
            }
            if (util_1.isArray(val) || util_1.isString(val)) {
                return val.length > 0;
            }
            return true;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.focusNext = function () {
            this._form && this._form.tabFocus(this);
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.ngOnDestroy = function () {
            (void 0) /* assert */;
            var /** @type {?} */ form = this._form;
            form && form.deregister(this);
            this._init = false;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.ngAfterContentInit = function () {
            this._initialize();
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype.initFocus = function () {
            var /** @type {?} */ ele = this._elementRef.nativeElement.querySelector('button');
            ele && ele.focus();
        };
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        BaseInput.prototype._inputNormalize = function (val) {
            return val;
        };
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        BaseInput.prototype._inputShouldChange = function (val) {
            return this._value !== val;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._inputChangeEvent = function () {
            return this;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._inputNgModelEvent = function () {
            return this._value;
        };
        /**
         * @hidden
         * @return {?}
         */
        BaseInput.prototype._inputUpdated = function () {
            (void 0) /* assert */;
            var /** @type {?} */ item = this._item;
            if (item) {
                setControlCss(item, this._ngControl);
                // TODO remove all uses of input-has-value in v4
                var /** @type {?} */ hasValue = this.hasValue();
                item.setElementClass('input-has-value', hasValue);
                item.setElementClass('item-input-has-value', hasValue);
            }
        };
        return BaseInput;
    }(ion_1.Ion));
    BaseInput.propDecorators = {
        'ionFocus': [{ type: core_1.Output },],
        'ionChange': [{ type: core_1.Output },],
        'ionBlur': [{ type: core_1.Output },],
        'disabled': [{ type: core_1.Input },],
    };
    exports.BaseInput = BaseInput;
    function BaseInput_tsickle_Closure_declarations() {
        /** @type {?} */
        BaseInput.propDecorators;
        /** @type {?} */
        BaseInput.prototype._value;
        /** @type {?} */
        BaseInput.prototype._onChanged;
        /** @type {?} */
        BaseInput.prototype._onTouched;
        /** @type {?} */
        BaseInput.prototype._isFocus;
        /** @type {?} */
        BaseInput.prototype._labelId;
        /** @type {?} */
        BaseInput.prototype._disabled;
        /** @type {?} */
        BaseInput.prototype._debouncer;
        /** @type {?} */
        BaseInput.prototype._init;
        /** @type {?} */
        BaseInput.prototype._initModel;
        /** @type {?} */
        BaseInput.prototype.id;
        /**
         * \@output {Range} Emitted when the range selector drag starts.
         * @type {?}
         */
        BaseInput.prototype.ionFocus;
        /**
         * \@output {Range} Emitted when the range value changes.
         * @type {?}
         */
        BaseInput.prototype.ionChange;
        /**
         * \@output {Range} Emitted when the range selector drag ends.
         * @type {?}
         */
        BaseInput.prototype.ionBlur;
        /** @type {?} */
        BaseInput.prototype._defaultValue;
        /** @type {?} */
        BaseInput.prototype._form;
        /** @type {?} */
        BaseInput.prototype._item;
        /** @type {?} */
        BaseInput.prototype._ngControl;
    }
    /**
     * @param {?} element
     * @param {?} control
     * @return {?}
     */
    function setControlCss(element, control) {
        if (!control) {
            return;
        }
        element.setElementClass('ng-untouched', control.untouched);
        element.setElementClass('ng-touched', control.touched);
        element.setElementClass('ng-pristine', control.pristine);
        element.setElementClass('ng-dirty', control.dirty);
        element.setElementClass('ng-valid', control.valid);
        element.setElementClass('ng-invalid', !control.valid);
    }
});
//# sourceMappingURL=base-input.js.map