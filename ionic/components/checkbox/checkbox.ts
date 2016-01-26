import {Component, Optional, Input, HostListener} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {Form} from '../../util/form';
import {Item} from '../item/item';

/**
 * The checkbox is no different than the HTML checkbox input, except
 * it's styled accordingly to the the platform and design mode, such
 * as iOS or Material Design.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/js/latest/api/core/Form-interface.html) for more info on forms and input.
 *
 * @property [checked] - whether or not the checkbox is checked (defaults to false)
 * @property [value] - the value of the checkbox component
 * @property [disabled] - whether or not the checkbox is disabled or not.
 *
 * @usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-checkbox value="pepperoni" checked="true"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-checkbox value="sausage"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-checkbox value="mushrooms"></ion-checkbox>
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
  }
})
export class Checkbox {
  private _checked: any = false;
  private _disabled: any = false;
  private _labelId: string;

  id: string;

  @Input() value: string = '';

  constructor(
    private _form: Form,
    @Optional() private _item: Item,
    @Optional() ngControl: NgControl
  ) {
    _form.register(this);

    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    if (_item) {
      this.id = 'chk-' + _item.registerInput('checkbox');
      this._labelId = 'lbl-' + _item.id;
      this._item.setCssClass('item-checkbox', true);
    }
  }

  /**
   * @private
   * Toggle the checked state of the checkbox. Calls onChange to pass the updated checked state to the model (Control).
   */
  toggle() {
    this.checked = !this.checked;
  }

  @Input()
  get checked() {
    return this._checked;
  }

  set checked(val) {
    if (!this._disabled) {
      this._checked = (val === true || val === 'true');
      this.onChange(this._checked);
      this._item && this._item.setCssClass('item-checkbox-checked', this._checked);
    }
  }

  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(val) {
    this._disabled = (val === true || val === 'true');
    this._item && this._item.setCssClass('item-checkbox-disabled', this._disabled);
  }

  /**
   * @private
   */
  @HostListener('click', ['$event'])
  private _click(ev) {
    console.debug('checkbox, checked', this.value);
    ev.preventDefault();
    ev.stopPropagation();
    this.toggle();
  }

  /**
   * @private
   * Angular2 Forms API method called by the model (Control) on change to update
   * the checked value.
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L34
   */
  writeValue(value) {
    this.checked = value;
  }

  /**
   * @private
   */
  onChange(val) {
    // TODO: figure the whys and the becauses
  }

  /**
   * @private
   */
  onTouched(val) {
    // TODO: figure the whys and the becauses
  }

  /**
   * @private
   * Angular2 Forms API method called by the view (NgControl) to register the
   * onChange event handler that updates the model (Control).
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L27
   * @param {Function} fn  the onChange event handler.
   */
  registerOnChange(fn) { this.onChange = fn; }

  /**
   * @private
   * Angular2 Forms API method called by the the view (NgControl) to register
   * the onTouched event handler that marks model (Control) as touched.
   * @param {Function} fn  onTouched event handler.
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }
}
