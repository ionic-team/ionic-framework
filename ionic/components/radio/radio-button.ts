import {Component, Optional, Input, Output, HostListener, EventEmitter} from 'angular2/core';

import {Form} from '../../util/form';
import {isTrueProperty, isPresent, isBlank, isCheckedProperty} from '../../util/util';
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
 * See the [Angular 2 Docs](https://angular.io/docs/ts/latest/guide/forms.html) for
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
  private _checked: boolean = false;
  private _disabled: boolean = false;
  private _labelId: string;
  private _value: any = null;

  /**
   * @private
   */
  id: string;

  /**
   * @output {any} expression to be evaluated when selected
   */
  @Output() select: EventEmitter<any> = new EventEmitter();

  constructor(
    private _form: Form,
    @Optional() private _item: Item,
    @Optional() private _group: RadioGroup
  ) {
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
      this._item.setCssClass('item-radio', true);
    }
  }

  /**
   * @private
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
   * @private
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(isChecked: boolean) {
    this._checked = isTrueProperty(isChecked);

    if (this._item) {
      this._item.setCssClass('item-radio-checked', this._checked);
    }
  }

  /**
   * @private
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(val: boolean) {
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
    this.select.emit(this.value);
  }

  /**
   * @private
   */
  ngOnInit() {
    if (this._group && isPresent(this._group.value)) {
      this.checked = isCheckedProperty(this._group.value, this.value);
    }
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
    this._group.remove(this);
  }
}
