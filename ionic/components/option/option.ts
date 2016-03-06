import {Directive, ElementRef, Input, Output, EventEmitter} from 'angular2/core';

import {isPresent, isTrueProperty} from '../../util/util';

/**
 * @name Option
 * @description
 * `ion-option` is a child component of `ion-select`. Similar to the native option element, `ion-option` can take a value and a checked property.
 *
 * @demo /docs/v2/demos/item-sliding/
 */
@Directive({
  selector: 'ion-option'
})
export class Option {
  private _checked: any = false;
  private _value;

  /**
   * @input {any} Event to evaluate when option has changed
   */
  @Output() select: EventEmitter<any> = new EventEmitter();

  constructor(private _elementRef: ElementRef) {}

  /**
   * @input {boolean} Whether or not the option is already checked and selected
   */
  @Input()
  get checked() {
    return this._checked;
  }

  set checked(val) {
    this._checked = isTrueProperty(val);
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

  set value(val) {
    this._value = val;
  }

  /**
   * @private
   */
  get text() {
    return this._elementRef.nativeElement.textContent;
  }
}
