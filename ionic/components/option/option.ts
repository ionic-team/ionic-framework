import {Directive, ElementRef, Input} from 'angular2/core';

import {isDefined, isTrueProperty} from '../../util/util';

/**
 * @name Option
 */
@Directive({
  selector: 'ion-option'
})
export class Option {
  private _checked: any = false;
  private _value;

  constructor(private _elementRef: ElementRef) {}

  @Input()
  get checked() {
    return this._checked;
  }

  set checked(val) {
    this._checked = isTrueProperty(val);
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
