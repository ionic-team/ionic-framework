import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import { isPresent, isTrueProperty } from '../../util/util';

/**
 * @name Option
 * @description
 * `ion-option` is a child component of `ion-select`. Similar to the native option element, `ion-option` can take a value and a selected property.
 *
 * @demo /docs/demos/src/select/
 */
@Directive({
  selector: 'ion-option'
})
export class Option {

  _selected: boolean = false;
  _disabled: boolean = false;
  _value: any;

  /**
   * @input {boolean} If true, the user cannot interact with this element.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
  }

  /**
   * @input {boolean} If true, the element is selected.
   */
  @Input()
  get selected(): boolean {
    return this._selected;
  }
  set selected(val: boolean) {
    this._selected = isTrueProperty(val);
  }

  /**
   * @input {any} The value of the option.
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
   * @output {any} Event to evaluate when option is selected.
   */
  @Output() ionSelect: EventEmitter<any> = new EventEmitter();

  constructor(private _elementRef: ElementRef) {}

  /**
   * @hidden
   */
  get text() {
    return this._elementRef.nativeElement.textContent;
  }
}
