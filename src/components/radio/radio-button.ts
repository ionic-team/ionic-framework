import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { Form, IonicTapInput } from '../../util/form';
import { Ion } from '../ion';
import { isBlank, isCheckedProperty, isPresent, isTrueProperty } from '../../util/util';
import { Item } from '../item/item';
import { RadioGroup } from './radio-group';


/**
 * @description
 * A radio button is a button that can be either checked or unchecked. A user can tap
 * the button to check or uncheck it. It can also be checked from the template using
 * the `checked` property.
 *
 * Use an element with a `radio-group` attribute to group a set of radio buttons. When
 * radio buttons are inside a [radio group](../RadioGroup), exactly one radio button
 * in the group can be checked at any time. If a radio button is not placed in a group,
 * they will all have the ability to be checked at the same time.
 *
 * See the [Angular Forms Docs](https://angular.io/docs/ts/latest/guide/forms.html) for
 * more information on forms and input.
 *
 * @usage
 * ```html
 * <ion-list radio-group [(ngModel)]="relationship">
 *   <ion-item>
 *     <ion-label>Friends</ion-label>
 *     <ion-radio value="friends" checked></ion-radio>
 *   </ion-item>
 *   <ion-item>
 *     <ion-label>Family</ion-label>
 *     <ion-radio value="family"></ion-radio>
 *   </ion-item>
 *   <ion-item>
 *     <ion-label>Enemies</ion-label>
 *     <ion-radio value="enemies" [disabled]="isDisabled"></ion-radio>
 *   </ion-item>
 * </ion-list>
 * ```
 * @demo /docs/demos/src/radio/
 * @see {@link /docs/components#radio Radio Component Docs}
 * @see {@link ../RadioGroup RadioGroup API Docs}
 */
@Component({
  selector: 'ion-radio',
  template:
    '<div class="radio-icon" [class.radio-checked]="_checked"> ' +
      '<div class="radio-inner"></div> ' +
    '</div> ' +
    '<button role="radio" ' +
            'type="button" ' +
            'ion-button="item-cover" ' +
            '[id]="id" ' +
            '[attr.aria-checked]="_checked" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover"> ' +
    '</button>',
  host: {
    '[class.radio-disabled]': '_disabled'
  },
  encapsulation: ViewEncapsulation.None,
})
export class RadioButton extends Ion implements IonicTapInput, OnDestroy, OnInit {

  /**
   * @internal
   */
  _checked: boolean = false;

  /**
   * @internal
   */
  _disabled: boolean = false;

  /**
   * @internal
   */
  _labelId: string;

  /**
   * @internal
   */
  _value: any = null;

  /**
   * @internal
   */
  id: string;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Input()
  set color(val: string) {
    this._setColor(val);

    if (this._item) {
      this._item._updateColor(val, 'item-radio');
    }
  }

  /**
   * @output {any} Emitted when the radio button is selected.
   */
  @Output() ionSelect: EventEmitter<any> = new EventEmitter();

  constructor(
    private _form: Form,
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() private _item: Item,
    @Optional() private _group: RadioGroup
  ) {
    super(config, elementRef, renderer, 'radio');
    _form.register(this);

    if (_group) {
      // register with the radiogroup
      this.id = 'rb-' + _group.add(this);
    }

    if (_item) {
      // register the input inside of the item
      // reset to the item's id instead of the radiogroup id
      this.id = 'rb-' + _item.registerInput('radio');
      this._labelId = 'lbl-' + _item.id;
      this._item.setElementClass('item-radio', true);
    }
  }

  /**
   * @input {any} The value of the radio button. Defaults to the generated id.
   */
  @Input()
  get value(): any {
    // if the value is not defined then use it's unique id
    return isBlank(this._value) ? this.id : this._value;
  }
  set value(val: any) {
    this._value = val;
  }

  /**
   * @input {boolean} If true, the element is selected, and other buttons in the group are unselected.
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(val: boolean) {
    this._checked = isTrueProperty(val);

    if (this._item) {
      this._item.setElementClass('item-radio-checked', this._checked);
    }
  }

  /**
   * @input {boolean} If true, the user cannot interact with this element.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled || (this._group != null && this._group.disabled);
  }
  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setElementClass('item-radio-disabled', this._disabled);
  }

  /**
   * @hidden
   */
  initFocus() {
    this._elementRef.nativeElement.querySelector('button').focus();
  }

  /**
   * @internal
   */
  @HostListener('click', ['$event'])
  _click(ev: UIEvent) {
    console.debug('radio, select', this.id);
    ev.preventDefault();
    ev.stopPropagation();

    this.checked = true;
    this.ionSelect.emit(this.value);
  }

  /**
   * @internal
   */
  ngOnInit() {
    if (this._group && isPresent(this._group.value)) {
      this.checked = isCheckedProperty(this._group.value, this.value);
    }

    if (this._group && this._group.disabled) {
      this.disabled = this._group.disabled;
    }
  }

  /**
   * @internal
   */
  ngOnDestroy() {
    this._form.deregister(this);
    this._group && this._group.remove(this);
  }
}
