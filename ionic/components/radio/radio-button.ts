import {Component, Optional, Input, Output, HostListener, EventEmitter} from 'angular2/core';

import {Form} from '../../util/form';
import {isTrueProperty, isDefined} from '../../util/util';
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

  id: string;

  @Input() value: string = '';
  @Output() select: EventEmitter<RadioButton> = new EventEmitter();

  constructor(
    private _form: Form,
    @Optional() private _item: Item,
    @Optional() private _group: RadioGroup
  ) {
    _form.register(this);

    if (_item) {
      this.id = 'rb-' + _item.registerInput('radio');
      this._labelId = 'lbl-' + _item.id;
      this._item.setCssClass('item-radio', true);
    }

    console.log(this.value);

    if (_group) {
      _group.register(this);
    }
  }

  check() {
    this.checked = true;
  }

  @Input()
  get checked() {
    return this._checked;
  }

  set checked(val) {
    if (!this._disabled) {
      this._checked = isTrueProperty(val);
      this.select.emit(this);
      this._item && this._item.setCssClass('item-radio-checked', this._checked);
    }
  }

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
  setChecked(val: boolean) {
    this._checked = isTrueProperty(val);
    this._item && this._item.setCssClass('item-radio-checked', val);
  }

  /**
   * @private
   */
  @HostListener('click', ['$event'])
  private _click(ev) {
    console.debug('radio, select', this.id);
    ev.preventDefault();
    ev.stopPropagation();
    this.check();
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }
}
