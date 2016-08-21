import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import { isPresent, isTrueProperty } from '../../util/util';

/**
 * @name Option
 * @description
 * `ion-option` is a child component of `ion-select`. Similar to the native option element, `ion-option` can take a value and a selected property.
 *
 * @demo /docs/v2/demos/select/
 */
@Directive({
  selector: 'ion-option'
})
export class Option {
  private _selected: any = false;
  private _disabled: any = false;
  private _value: any;

  /**
   * @input {any} Event to evaluate when option is selected
   */
  @Output() ionSelect: EventEmitter<any> = new EventEmitter();

  constructor(private _elementRef: ElementRef) {}

  /**
   * @input {boolean} Whether or not the option is already selected
   */
  @Input()
  get selected() {
    return this._selected;
  }

  set selected(val) {
    this._selected = isTrueProperty(val);
  }

  /**
   * @input {any} The value of the option
   */
  @Input()
  get value() {
    if (isPresent(this._value)) {
      return this._value;
    }
    return this.text;
  }

  set value(val: any) {
    this._value = val;
  }

  /**
   * @input {boolean} Whether or not the option is disabled
   */
  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(val) {
    this._disabled = isTrueProperty(val);
  }

  /**
   * @internal
   */
  get text() {
    return this._elementRef.nativeElement.textContent;
  }
}
