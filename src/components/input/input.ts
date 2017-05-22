import { Component, Optional, ElementRef, EventEmitter, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';

import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { isTrueProperty } from '../../util/util';
import { Item } from '../item/item';


/**
 * @name Input
 * @description
 *
 * `ion-input` is meant for text type inputs only, such as `text`,
 * `password`, `email`, `number`, `search`, `tel`, and `url`. Ionic
 * still uses an actual `<input type="text">` HTML element within the
 * component, however, with Ionic wrapping the native HTML input
 * element it's better able to handle the user experience and
 * interactivity.
 *
 * Similarly, `<ion-textarea>` should be used in place of `<textarea>`.
 *
 * An `ion-input` is **not** used for non-text type inputs, such as a
 * `checkbox`, `radio`, `toggle`, `range`, `select`, etc.
 *
 * Along with the blur/focus events, `input` support all standard text input
 * events like `keyup`, `keydown`, `keypress`, `input`,etc. Any standard event
 * can be attached and will function as expected.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item>
 *     <ion-label color="primary">Inline Label</ion-label>
 *     <ion-input placeholder="Text Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" fixed>Fixed Label</ion-label>
 *     <ion-input type="tel" placeholder="Tel Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input type="number" placeholder="Number Input with no label"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="email" placeholder="Email Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="password" placeholder="Password Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" floating>Floating Label</ion-label>
 *     <ion-input></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input placeholder="Clear Input" clearInput></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-textarea placeholder="Enter a description"></ion-textarea>
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * @demo /docs/demos/src/input/
 */
@Component({
  selector: 'ion-input',
  template:
  '<input class="text-input" ' +
    '[(ngModel)]="value"' +
    '[type]="type" ' +
    '(focus) = "_onFocus($event)" ' +
    '(blur)="_onBlur($event)" ' +
    '(input)="ionInput.emit($event)" ' +
    '(keydown)="_onKeydown($event)" ' +
    '[placeholder]="placeholder" ' +
    '[disabled]="_disabled" ' +
    '[min]="min" ' +
    '[max]="max" ' +
    '[step]="step" ' +
    '[readonly]="_readonly">' +
  '<button ion-button clear [hidden]="_clearInput" type="button" class="text-input-clear-icon" (click)="clearTextInput()" (mousedown)="clearTextInput()"></button>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInput extends BaseInput<string> {

  private _autoComplete: string;
  private _autoCorrect: string;
  private _clearInput: boolean = false;
  private _clearOnEdit: boolean;
  private _didBlurAfterEdit: boolean;
  private _readonly: boolean = false;


  /**
   * @input {number} How long, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
   */
  @Input()
  get debounce(): number {
    return this._debouncer.wait;
  }
  set debounce(val: number) {
    this._debouncer.wait = val;
  }

  /**
   * @input {boolean} If true, a clear icon will appear in the input when there is a value. Clicking it clears the input.
   */
  @Input()
  get clearInput() {
    return this._clearInput;
  }
  set clearInput(val: any) {
    this._clearInput = isTrueProperty(val);
  }

  /**
   * @input {boolean} If true, the user cannot modify the value.
   */
  @Input()
  get readonly() {
    return this._readonly;
  }
  set readonly(val: boolean) {
    this._readonly = isTrueProperty(val);
  }

  /**
   * @input {boolean} If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @Input()
  get clearOnEdit() {
    return this._clearOnEdit;
  }
  set clearOnEdit(val: any) {
    this._clearOnEdit = isTrueProperty(val);
  }

  /**
   * @input {string} Instructional text that shows before the input has a value.
   */
  @Input() placeholder: string = '';

  /**
   * @input {number} The minimum value, which must not be greater than its maximum (max attribute) value.
   */
  @Input() min: number;

  /**
   * @input {number} The maximum value, which must not be less than its minimum (min attribute) value.
   */
  @Input() max: number;

  /**
   * @input {number} Works with the min and max attributes to limit the increments at which a value can be set.
   */
  @Input() step: number;

  /**
   * @input {string} The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
   */
  @Input() type: string = 'text';

  /**
   * @hidden
   */
  @Input() autocorrect: string;

  /**
   * @hidden
   */
  @Input() autocomplete: string;

  /**
   * @hidden
   */
  @Input() autofocus: string;

  /**
   * @hidden
   */
  @Output() ionInput = new EventEmitter<UIEvent>();

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    form: Form,
    @Optional() item: Item,
    @Optional() ngControl: NgControl,
  ) {
    super(config, elementRef, renderer, 'input', '', form, item, ngControl);

    this._autoComplete = config.get('autocomplete', 'off');
    this._autoCorrect = config.get('autocorrect', 'off');
  }

  _onKeydown(ev: any) {
    const value = ev.target;
    this.checkClearOnEdit(value);
  }

  _onFocus(ev: any) {
    this._fireFocus();
  }

  _onBlur(ev: any) {
    if (this._clearOnEdit && this.hasValue()) {
      this._didBlurAfterEdit = true;
    }
    this._fireBlur();
  }

  /**
  * @hidden
  */
  clearTextInput() {
    this.value = null;
  }

  /**
  * Check if we need to clear the text input if clearOnEdit is enabled
  * @hidden
  */
  checkClearOnEdit(inputValue: string) {
    if (!this._clearOnEdit) {
      return;
    }

    // Did the input value change after it was blurred and edited?
    if (this._didBlurAfterEdit && this.hasValue()) {
      this.clearTextInput();
    }

    // Reset the flag
    this._didBlurAfterEdit = false;
  }

}

