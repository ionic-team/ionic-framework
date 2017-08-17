import { AfterContentInit, ElementRef, EventEmitter, Renderer } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NgControl } from '@angular/forms';
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
export declare class BaseInput<T> extends Ion implements CommonInput<T> {
    private _defaultValue;
    _form: Form;
    _item: Item;
    _ngControl: NgControl;
    _value: T;
    _onChanged: Function;
    _onTouched: Function;
    _isFocus: boolean;
    _labelId: string;
    _disabled: boolean;
    _debouncer: TimeoutDebouncer;
    _init: boolean;
    _initModel: boolean;
    id: string;
    /**
     * @output {Range} Emitted when the range selector drag starts.
     */
    ionFocus: EventEmitter<BaseInput<T>>;
    /**
     * @output {Range} Emitted when the range value changes.
     */
    ionChange: EventEmitter<BaseInput<T>>;
    /**
     * @output {Range} Emitted when the range selector drag ends.
     */
    ionBlur: EventEmitter<BaseInput<T>>;
    /**
     * @input {boolean} If true, the user cannot interact with this element.
     */
    disabled: boolean;
    constructor(config: Config, elementRef: ElementRef, renderer: Renderer, name: string, _defaultValue: T, _form: Form, _item: Item, _ngControl: NgControl);
    value: T;
    setValue(val: any): void;
    /**
     * @hidden
     */
    setDisabledState(isDisabled: boolean): void;
    /**
     * @hidden
     */
    writeValue(val: any): void;
    /**
     * @hidden
     */
    _writeValue(val: any): boolean;
    /**
     * @hidden
     */
    _fireIonChange(): void;
    /**
     * @hidden
     */
    registerOnChange(fn: Function): void;
    /**
     * @hidden
     */
    registerOnTouched(fn: any): void;
    /**
     * @hidden
     */
    _initialize(): void;
    /**
     * @hidden
     */
    _fireFocus(): void;
    /**
     * @hidden
     */
    _fireBlur(): void;
    /**
     * @hidden
     */
    private _setFocus(isFocused);
    /**
     * @hidden
     */
    private onChange();
    /**
     * @hidden
     */
    isFocus(): boolean;
    /**
     * @hidden
     */
    hasValue(): boolean;
    /**
     * @hidden
     */
    focusNext(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    /**
     * @hidden
     */
    initFocus(): void;
    /**
     * @hidden
     */
    _inputNormalize(val: any): T;
    /**
     * @hidden
     */
    _inputShouldChange(val: T): boolean;
    /**
     * @hidden
     */
    _inputChangeEvent(): any;
    /**
     * @hidden
     */
    _inputNgModelEvent(): any;
    /**
     * @hidden
     */
    _inputUpdated(): void;
}
