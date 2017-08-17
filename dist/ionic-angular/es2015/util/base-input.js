import { EventEmitter, Input, Output } from '@angular/core';
import { deepCopy, isArray, isPresent, isString, isTrueProperty, isUndefined } from './util';
import { Ion } from '../components/ion';
import { TimeoutDebouncer } from './debouncer';
export class BaseInput extends Ion {
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
    constructor(config, elementRef, renderer, name, _defaultValue, _form, _item, _ngControl) {
        super(config, elementRef, renderer, name);
        this._defaultValue = _defaultValue;
        this._form = _form;
        this._item = _item;
        this._ngControl = _ngControl;
        this._isFocus = false;
        this._disabled = false;
        this._debouncer = new TimeoutDebouncer(0);
        this._init = false;
        this._initModel = false;
        /**
         * \@output {Range} Emitted when the range selector drag starts.
         */
        this.ionFocus = new EventEmitter();
        /**
         * \@output {Range} Emitted when the range value changes.
         */
        this.ionChange = new EventEmitter();
        /**
         * \@output {Range} Emitted when the range selector drag ends.
         */
        this.ionBlur = new EventEmitter();
        _form && _form.register(this);
        this._value = deepCopy(this._defaultValue);
        if (_item) {
            (void 0) /* assert */;
            this.id = name + '-' + _item.registerInput(name);
            this._labelId = _item.labelId;
            this._item.setElementClass('item-' + name, true);
        }
        // If the user passed a ngControl we need to set the valueAccessor
        if (_ngControl) {
            _ngControl.valueAccessor = this;
        }
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
        this.setDisabledState(val);
    }
    /**
     * @return {?}
     */
    get value() {
        return this._value;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set value(val) {
        if (this._writeValue(val)) {
            this.onChange();
            this._fireIonChange();
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    setValue(val) {
        this.value = val;
    }
    /**
     * @hidden
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._disabled = isDisabled = isTrueProperty(isDisabled);
        this._item && this._item.setElementClass(`item-${this._componentName}-disabled`, isDisabled);
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    writeValue(val) {
        if (this._writeValue(val)) {
            if (this._initModel) {
                this._fireIonChange();
            }
            else if (this._init) {
                // ngModel fires the first time too late, we need to skip the first ngModel update
                this._initModel = true;
            }
        }
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    _writeValue(val) {
        (void 0) /* assert */;
        if (isUndefined(val)) {
            return false;
        }
        const /** @type {?} */ normalized = (val === null)
            ? deepCopy(this._defaultValue)
            : this._inputNormalize(val);
        const /** @type {?} */ notUpdate = isUndefined(normalized) || !this._inputShouldChange(normalized);
        if (notUpdate) {
            return false;
        }
        (void 0) /* console.debug */;
        this._value = normalized;
        if (this._init) {
            this._inputUpdated();
        }
        return true;
    }
    /**
     * @hidden
     * @return {?}
     */
    _fireIonChange() {
        if (this._init) {
            this._debouncer.debounce(() => {
                (void 0) /* assert */;
                this.ionChange.emit(this._inputChangeEvent());
                this._initModel = true;
            });
        }
    }
    /**
     * @hidden
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChanged = fn;
    }
    /**
     * @hidden
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * @hidden
     * @return {?}
     */
    _initialize() {
        if (this._init) {
            (void 0) /* assert */;
            return;
        }
        this._init = true;
        if (isPresent(this._value)) {
            this._inputUpdated();
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    _fireFocus() {
        if (this._isFocus) {
            return;
        }
        (void 0) /* console.debug */;
        this._form && this._form.setAsFocused(this);
        this._setFocus(true);
        this.ionFocus.emit(this);
    }
    /**
     * @hidden
     * @return {?}
     */
    _fireBlur() {
        if (!this._isFocus) {
            return;
        }
        (void 0) /* console.debug */;
        this._form && this._form.unsetAsFocused(this);
        this._setFocus(false);
        this.ionBlur.emit(this);
    }
    /**
     * @hidden
     * @param {?} isFocused
     * @return {?}
     */
    _setFocus(isFocused) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        (void 0) /* assert */;
        this._isFocus = isFocused;
        const /** @type {?} */ item = this._item;
        if (item) {
            item.setElementClass('input-has-focus', isFocused);
            item.setElementClass('item-input-has-focus', isFocused);
        }
        this._inputUpdated();
    }
    /**
     * @hidden
     * @return {?}
     */
    onChange() {
        this._onChanged && this._onChanged(this._inputNgModelEvent());
        this._onTouched && this._onTouched();
    }
    /**
     * @hidden
     * @return {?}
     */
    isFocus() {
        return this._isFocus;
    }
    /**
     * @hidden
     * @return {?}
     */
    hasValue() {
        const /** @type {?} */ val = this._value;
        if (!isPresent(val)) {
            return false;
        }
        if (isArray(val) || isString(val)) {
            return val.length > 0;
        }
        return true;
    }
    /**
     * @hidden
     * @return {?}
     */
    focusNext() {
        this._form && this._form.tabFocus(this);
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        (void 0) /* assert */;
        const /** @type {?} */ form = this._form;
        form && form.deregister(this);
        this._init = false;
    }
    /**
     * @hidden
     * @return {?}
     */
    ngAfterContentInit() {
        this._initialize();
    }
    /**
     * @hidden
     * @return {?}
     */
    initFocus() {
        const /** @type {?} */ ele = this._elementRef.nativeElement.querySelector('button');
        ele && ele.focus();
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    _inputNormalize(val) {
        return val;
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    _inputShouldChange(val) {
        return this._value !== val;
    }
    /**
     * @hidden
     * @return {?}
     */
    _inputChangeEvent() {
        return this;
    }
    /**
     * @hidden
     * @return {?}
     */
    _inputNgModelEvent() {
        return this._value;
    }
    /**
     * @hidden
     * @return {?}
     */
    _inputUpdated() {
        (void 0) /* assert */;
        const /** @type {?} */ item = this._item;
        if (item) {
            setControlCss(item, this._ngControl);
            // TODO remove all uses of input-has-value in v4
            let /** @type {?} */ hasValue = this.hasValue();
            item.setElementClass('input-has-value', hasValue);
            item.setElementClass('item-input-has-value', hasValue);
        }
    }
}
BaseInput.propDecorators = {
    'ionFocus': [{ type: Output },],
    'ionChange': [{ type: Output },],
    'ionBlur': [{ type: Output },],
    'disabled': [{ type: Input },],
};
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
//# sourceMappingURL=base-input.js.map