import { AfterContentInit, ElementRef, EventEmitter, Input, NgZone, Output, Renderer } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NgControl } from '@angular/forms';

import { assert, deepCopy, isArray, isPresent, isString, isTrueProperty, isUndefined } from './util';
import { IonicFormInput } from './form';
import { Ion } from '../components/ion';
import { Config } from '../config/config';
import { Item } from '../components/item/item';
import { Form } from './form';
import { TimeoutDebouncer } from './debouncer';


export interface CommonInput<T> extends ControlValueAccessor, AfterContentInit, IonicFormInput {

  id: string;
  disabled: boolean;
  value: T;

  ionFocus: EventEmitter<CommonInput<T>>;
  ionChange: EventEmitter<BaseInput<T>>;
  ionBlur: EventEmitter<BaseInput<T>>;

  initFocus(): void;
  isFocus(): boolean;

  _inputNormalize(val: any): T;
  _inputShouldChange(val: T): boolean;
  _inputUpdated(): void;
}

export class BaseInput<T> extends Ion implements CommonInput<T> {

  _value: T;
  _onChanged: Function;
  _onTouched: Function;
  _isFocus: boolean = false;
  _labelId: string;
  _disabled: boolean = false;
  _debouncer: TimeoutDebouncer = new TimeoutDebouncer(0);
  _init: boolean = false;
  _initModel: boolean = false;

  id: string;

  /**
   * @output {Range} Emitted when the range selector drag starts.
   */
  @Output() ionFocus: EventEmitter<BaseInput<T>> = new EventEmitter<BaseInput<T>>();

  /**
   * @output {Range} Emitted when the range value changes.
   */
  @Output() ionChange: EventEmitter<BaseInput<T>> = new EventEmitter<BaseInput<T>>();

  /**
   * @output {Range} Emitted when the range selector drag ends.
   */
  @Output() ionBlur: EventEmitter<BaseInput<T>> = new EventEmitter<BaseInput<T>>();

  /**
   * @input {boolean} If true, the user cannot interact with this element.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this.setDisabledState(val);
  }

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    name: string,
    private _defaultValue: T,
    public _form: Form,
    public _item: Item,
    public _ngControl: NgControl
  ) {
    super(config, elementRef, renderer, name);
    _form && _form.register(this);
    this._value = deepCopy(this._defaultValue);

    if (_item) {
      assert('lbl-' + _item.id === _item.labelId, 'labelId was not calculated correctly');
      this.id = name + '-' + _item.registerInput(name);
      this._labelId = _item.labelId;
      this._item.setElementClass('item-' + name, true);
    }

    // If the user passed a ngControl we need to set the valueAccessor
    if (_ngControl) {
      _ngControl.valueAccessor = this;
    }
  }

  get value(): T {
    return this._value;
  }
  set value(val: T) {
    if (this._writeValue(val)) {
      this.onChange();
      this._fireIonChange();
    }
  }

  // 1. Updates the value
  // 2. Calls _inputUpdated()
  // 3. Dispatch onChange events
  setValue(val: any) {
    this.value = val;
  }

  /**
   * @hidden
   */
  setDisabledState(isDisabled: boolean) {
    this._disabled = isDisabled = isTrueProperty(isDisabled);
    this._item && this._item.setElementClass(`item-${this._componentName}-disabled`, isDisabled);
  }

  /**
   * @hidden
   */
  writeValue(val: any) {
    if (this._writeValue(val)) {
      if (this._initModel) {
        this._fireIonChange();
      } else if (this._init) {
        // ngModel fires the first time too late, we need to skip the first ngModel update
        this._initModel = true;
      }
    }

  }

  /**
   * @hidden
   */
  _writeValue(val: any): boolean {
    assert(NgZone.isInAngularZone(), 'callback should be zoned');

    if (isUndefined(val)) {
      return false;
    }
    const normalized = (val === null)
      ? deepCopy(this._defaultValue)
      : this._inputNormalize(val);

    const notUpdate = isUndefined(normalized) || !this._inputShouldChange(normalized);
    if (notUpdate) {
      return false;
    }

    console.debug('BaseInput: value changed:', normalized, this);
    this._value = normalized;
    if (this._init) {
      this._inputUpdated();
    }
    return true;
  }

  /**
   * @hidden
   */
  _fireIonChange() {
    if (this._init) {
      this._debouncer.debounce(() => {
        assert(NgZone.isInAngularZone(), 'IonChange: should be zoned');
        this.ionChange.emit(this._inputChangeEvent());
        this._initModel = true;
      });
    }
  }

  /**
   * @hidden
   */
  registerOnChange(fn: Function) {
    this._onChanged = fn;
  }

  /**
   * @hidden
   */
  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  /**
   * @hidden
   */
  _initialize() {
    if (this._init) {
      assert(false, 'input was already initilized');
      return;
    }
    this._init = true;
    if (isPresent(this._value)) {
      this._inputUpdated();
    }
  }

  /**
   * @hidden
   */
  _fireFocus() {
    if (this._isFocus) {
      return;
    }
    console.debug('BaseInput: focused:', this);

    this._form && this._form.setAsFocused(this);
    this._setFocus(true);
    this.ionFocus.emit(this);
  }

  /**
   * @hidden
   */
  _fireBlur() {
    if (!this._isFocus) {
      return;
    }
    console.debug('BaseInput: blurred:', this);

    this._form && this._form.unsetAsFocused(this);
    this._setFocus(false);
    this._fireTouched();
    this.ionBlur.emit(this);
  }

  /**
   * @hidden
   */
  _fireTouched() {
    this._onTouched && this._onTouched();
  }

  /**
   * @hidden
   */
  private _setFocus(isFocused: boolean) {
    assert(this._init, 'component was not initialized');
    assert(NgZone.isInAngularZone(), '_fireFocus: should be zoned');
    assert(isFocused !== this._isFocus, 'bad internal state');

    this._isFocus = isFocused;
    const item = this._item;
    if (item) {
      item.setElementClass('input-has-focus', isFocused);
      item.setElementClass('item-input-has-focus', isFocused);
    }
    this._inputUpdated();
  }

  /**
   * @hidden
   */
  private onChange() {
    this._onChanged && this._onChanged(this._inputNgModelEvent());
  }

  /**
   * @hidden
   */
  isFocus(): boolean {
    return this._isFocus;
  }

  /**
   * @hidden
   */
  hasValue(): boolean {
    const val = this._value;
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
   */
  focusNext() {
    this._form && this._form.tabFocus(this);
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    assert(this._init, 'input was destroed without being initialized');

    const form = this._form;
    form && form.deregister(this);
    this._init = false;
  }

  /**
   * @hidden
   */
  ngAfterContentInit() {
    this._initialize();
  }

  /**
   * @hidden
   */
  initFocus() {
    const ele = this._elementRef.nativeElement.querySelector('button');
    ele && ele.focus();
  }

  /**
   * @hidden
   */
  _inputNormalize(val: any): T {
    return val;
  }

  /**
   * @hidden
   */
  _inputShouldChange(val: T): boolean {
    return this._value !== val;
  }

  /**
   * @hidden
   */
  _inputChangeEvent(): any {
    return this;
  }

  /**
   * @hidden
   */
  _inputNgModelEvent(): any {
    return this._value;
  }


  /**
   * @hidden
   */
  _inputUpdated() {
    assert(this._init, 'component should be initialized');
    const item = this._item;
    if (item) {
      setControlCss(item, this._ngControl);
      // TODO remove all uses of input-has-value in v4
      let hasValue = this.hasValue();
      item.setElementClass('input-has-value', hasValue);
      item.setElementClass('item-input-has-value', hasValue);
    }
  }
}

function setControlCss(element: Ion, control: NgControl) {
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
