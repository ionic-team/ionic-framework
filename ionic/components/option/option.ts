import {Directive, ElementRef, Input} from 'angular2/core';

import {isDefined} from '../../util/util';

/**
 * @name Option
 */
@Directive({
  selector: 'ion-option'
})
export class Option {
  private _checked: boolean = false;
  private _value;

  constructor(private _elementRef: ElementRef) {}

  @Input()
  get checked() {
    return this._checked;
  }

  set checked(val: any) {
    this._checked = (val === 'true' || val === true || val === '');
  }

  @Input()
  get value() {
    if (isDefined(this._value)) {
      return this._value;
    }
    return this.text;
  }

  set value(val) {
    this._value = val;
  }

  get text() {
    return this._elementRef.nativeElement.textContent;
  }
}
