import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


/**
  * @hidden
  */
@Directive({
  selector: 'ion-toggle',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: BooleanInput, multi: true }],
})
export class BooleanInput {
  id: string;
  _labelId: string;
  _chg: Function;
  _tch: Function;
  _dis: Function;

  @Output() ionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() ionFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() ionBlur: EventEmitter<any> = new EventEmitter<any>();


  constructor(public _el: ElementRef) {}

  /**
   * @input {boolean} If true, the element is selected.
   */
  @Input()
  get checked(): boolean {
    return this._el.nativeElement.checked;
  }
  set checked(val: boolean) {
    this._el.nativeElement.checked = val;
  }

  /**
   * @input {boolean} If true, the user cannot interact with this element.
   */
  @Input()
  get disabled(): boolean {
    return this._el.nativeElement.disabled;
  }
  set disabled(val: boolean) {
    this._el.nativeElement.disabled = val;
  }

  /**
   * @input {string}
   */
  @Input()
  get value(): string {
    return this._el.nativeElement.value;
  }
  set value(val: string) {
    this._el.nativeElement.value = val;
  }

  /**
   * @hidden
   */
  @HostListener('$ionChange', ['$event'])
  _onChange(ev: any) {
    ev.stopPropagation();
    this._chg && this._chg(ev.detail.checked);
    this._tch && this._tch();
    this.ionChange.emit(this);
  }

  /**
   * @hidden
   */
  @HostListener('$ionFocus', ['$event'])
  _onFocus(ev: any) {
    ev.stopPropagation();
    this.ionFocus.emit(this);
  }

  /**
   * @hidden
   */
  @HostListener('$ionBlur', ['$event'])
  _onBlur(ev: any) {
    ev.stopPropagation();
    this.ionBlur.emit(this);
  }

  /**
   * @hidden
   */
  writeValue(val: any) {
    if (this.checked !== val) {
      this.checked = val;
    }
  }

  /**
   * @hidden
   */
  registerOnChange(fn: any) {
    this._chg = fn;
  }

  /**
   * @hidden
   */
  registerOnTouched(fn: any) {
    this._tch = fn;
  }

  /**
   * @hidden
   */
  registerOnDisabledChange(fn: any) {
    this._dis = fn;
  }

  /**
   * @hidden
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}