import {Component, Optional, Input, Output, HostListener, EventEmitter} from 'angular2/core';

import {Form} from '../../util/form';
import {isTrueProperty, isDefined, isBlank} from '../../util/util';
import {Item} from '../item/item';
import {ListHeader} from '../list/list';
import {RadioGroup} from './radio-group';


/**
 * @description
 * A radio button with a unique value. Note that all `<ion-radio>`
 * components must be wrapped within a `<ion-list radio-group>`,
 * and there must be at least two `<ion-radio>` components within
 * the radio group.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/js/latest/api/forms/) for
 * more info on forms and input.
 *
 * @usage
 * ```html
 *
 * <ion-item>
 *   <ion-label>Radio Label</ion-label>
 *   <ion-radio value="radio-value"></ion-radio>
 * </ion-item>
 *
 * ```
 * @demo /docs/v2/demos/radio/
 * @see {@link /docs/v2/components#radio Radio Component Docs}
 */
@Component({
  selector: 'ion-radio',
  template:
    '<div class="radio-icon" [class.radio-checked]="_checked">' +
      '<div class="radio-inner"></div>' +
    '</div>' +
    '<button role="radio" ' +
            '[id]="id" ' +
            '[attr.aria-checked]="_checked" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover">' +
    '</button>',
  host: {
    '[class.radio-disabled]': '_disabled'
  }
})
export class RadioButton {
  private _checked: any = false;
  private _disabled: any = false;
  private _labelId: string;
  private _value = null;

  /**
   * @private
   */
  id: string;

  /**
   * @output {any} expression to be evaluated when clicked
   */
  @Output() select: EventEmitter<RadioButton> = new EventEmitter();

  constructor(
    private _form: Form,
    @Optional() private _item: Item,
    @Optional() private _group: RadioGroup
  ) {
    _form.register(this);

    if (_group) {
      // register with the radiogroup
      this.id = 'rb-' + _group.register(this);
    }

    if (_item) {
      // register the input inside of the item
      // reset to the item's id instead of the radiogroup id
      this.id = 'rb-' + _item.registerInput('radio');
      this._labelId = 'lbl-' + _item.id;
      this._item.setCssClass('item-radio', true);
    }
  }

  /**
   * @private
   */
  @Input()
  get value() {
    // if the value is not defined then use it's unique id
    return isBlank(this._value) ? this.id : this._value;
  }

  set value(val) {
    this._value = val;
  }

  /**
   * @private
   */
  @Input()
  get checked() {
    return this._checked;
  }

  set checked(isChecked) {
    if (!this._disabled) {
      // only check/uncheck if it's not disabled

      // emit the select event for the radiogroup to catch
      this._checked = isTrueProperty(isChecked);
      this.select.emit(this.value);

      // if it's a stand-alone radiobutton nothing else happens
      // if it was within a radiogroup then updateAsChecked will
      // get called again
      this.updateAsChecked(this._checked);
    }
  }

  /**
   * @private
   */
  updateAsChecked(val: boolean) {
    this._checked = val;
    if (this._item) {
      this._item.setCssClass('item-radio-checked', val);
    }
  }

  /**
   * @private
   */
  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(val) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setCssClass('item-radio-disabled', this._disabled);
  }

  /**
   * @private
   */
  @HostListener('click', ['$event'])
  private _click(ev) {
    console.debug('radio, select', this.id);
    ev.preventDefault();
    ev.stopPropagation();
    this.checked = true;
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }
}
