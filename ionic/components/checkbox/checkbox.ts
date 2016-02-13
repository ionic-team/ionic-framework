import {Component, Optional, Input, HostListener, Provider, forwardRef, Injector} from 'angular2/core';
import {NgControl, NG_VALUE_ACCESSOR} from 'angular2/common';

import {Form} from '../../util/form';
import {Item} from '../item/item';
import {isTrueProperty} from '../../util/util';

const CHECKBOX_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => Checkbox), multi: true});


/**
 * The checkbox is no different than the HTML checkbox input, except
 * it's styled accordingly to the the platform and design mode, such
 * as iOS or Material Design.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more info on forms and inputs.
 *
 *
 * @usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-checkbox [(ngModel)]="pepperoni" checked="true"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-checkbox [(ngModel)]="sausage" disabled="true"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-checkbox [(ngModel)]="mushrooms"></ion-checkbox>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 * @demo /docs/v2/demos/checkbox/
 * @see {@link /docs/v2/components#checkbox Checkbox Component Docs}
 */
@Component({
  selector: 'ion-checkbox',
  template:
    '<div class="checkbox-icon" [class.checkbox-checked]="_checked">' +
      '<div class="checkbox-inner"></div>' +
    '</div>' +
    '<button role="checkbox" ' +
            '[id]="id" ' +
            '[attr.aria-checked]="_checked" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover">' +
    '</button>',
  host: {
    '[class.checkbox-disabled]': '_disabled'
  },
  providers: [CHECKBOX_VALUE_ACCESSOR]
})
export class Checkbox {
  private _checked: any = false;
  private _disabled: any = false;
  private _labelId: string;
  private _fn: Function;

  /**
   * @private
   */
  id: string;

  constructor(
    private _form: Form,
    @Optional() private _item: Item,
    private _injector: Injector
  ) {
    _form.register(this);

    if (_item) {
      this.id = 'chk-' + _item.registerInput('checkbox');
      this._labelId = 'lbl-' + _item.id;
      this._item.setCssClass('item-checkbox', true);
    }
  }

  /**
   * @private
   */
  @HostListener('click', ['$event'])
  private _click(ev) {
    console.debug('checkbox, checked');
    ev.preventDefault();
    ev.stopPropagation();
    this.onChange(!this._checked);
  }

  /**
   * @input {boolean} whether or not the checkbox is checked (defaults to false)
   */
  @Input()
  get checked() {
    return this._checked;
  }

  set checked(val) {
    this._setChecked(isTrueProperty(val));
    this.onChange(this._checked);
  }

  /**
   * @private
   */
  private _setChecked(isChecked: boolean) {
    this._checked = isChecked;
    this._item && this._item.setCssClass('item-checkbox-checked', isChecked);
  }

  /**
   * @private
   */
  writeValue(val: any) {
    this._setChecked( isTrueProperty(val) );
  }

  /**
   * @private
   */
  registerOnChange(fn: Function): void {
    this._fn = fn;
    this.onChange = (isChecked: boolean) => {
      console.debug('checkbox, onChange', isChecked);
      fn(isChecked);
      this._setChecked(isChecked);
    };
  }

  /**
   * @private
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @input {boolean} whether or not the checkbox is disabled or not.
   */
  @Input()
  get disabled(): any {
    return this._disabled;
  }

  set disabled(val: any) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setCssClass('item-checkbox-disabled', this._disabled);
  }

  /**
   * @private
   */
  onChange(_) {}

  /**
   * @private
   */
  onTouched() {}

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }
}
