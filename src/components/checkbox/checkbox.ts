import { AfterContentInit, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { Item } from '../item/item';

export const CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Checkbox),
  multi: true
};

/**
 * @name Checkbox
 * @module ionic
 *
 * @description
 * The Checkbox is a simple component styled based on the mode. It can be
 * placed in an `ion-item` or used as a stand-alone checkbox.
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
 *      <ion-checkbox [(ngModel)]="pepperoni"></ion-checkbox>
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
 *
 * @demo /docs/v2/demos/src/checkbox/
 * @see {@link /docs/v2/components#checkbox Checkbox Component Docs}
 */
@Component({
  selector: 'ion-checkbox',
  template:
    '<div class="checkbox-icon" [class.checkbox-checked]="_checked">' +
      '<div class="checkbox-inner"></div>' +
    '</div>' +
    '<button role="checkbox" ' +
            'type="button" ' +
            'ion-button="item-cover" ' +
            '[id]="id" ' +
            '[attr.aria-checked]="_checked" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover"> ' +
    '</button>',
  host: {
    '[class.checkbox-disabled]': '_disabled'
  },
  providers: [CHECKBOX_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
})
export class Checkbox extends Ion implements AfterContentInit, ControlValueAccessor, OnDestroy {
  /** @private */
  _checked: boolean = false;
  /** @private */
  _init: boolean;
  /** @private */
  _disabled: boolean = false;
  /** @private */
  _labelId: string;
  /** @private */
  _fn: Function;
  /** @private */
  id: string;

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor('checkbox', val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('checkbox', val);
  }

  /**
   * @output {Checkbox} expression to evaluate when the checkbox value changes
   */
  @Output() ionChange: EventEmitter<Checkbox> = new EventEmitter<Checkbox>();

  constructor(
    config: Config,
    private _form: Form,
    @Optional() private _item: Item,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    super(config, elementRef, renderer);

    this.mode = config.get('mode');

    _form.register(this);

    if (_item) {
      this.id = 'chk-' + _item.registerInput('checkbox');
      this._labelId = 'lbl-' + _item.id;
      this._item.setElementClass('item-checkbox', true);
    }
  }

  /**
   * @private
   */
  @HostListener('click', ['$event'])
  _click(ev: UIEvent) {
    console.debug('checkbox, checked');
    ev.preventDefault();
    ev.stopPropagation();
    this.onChange(!this._checked);
  }

  /**
   * @input {boolean} whether or not the checkbox is checked (defaults to false)
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(val: boolean) {
    this._setChecked(isTrueProperty(val));
    this.onChange(this._checked);
  }

  /**
   * @private
   */
  _setChecked(isChecked: boolean) {
    if (!this._disabled && isChecked !== this._checked) {
      this._checked = isChecked;
      if (this._init) {
        this.ionChange.emit(this);
      }
      this._item && this._item.setElementClass('item-checkbox-checked', isChecked);
    }
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
      this.onTouched();
    };
  }

  /**
   * @private
   */
  registerOnTouched(fn: any) { this.onTouched = fn; }

  /**
   * @input {boolean} whether or not the checkbox is disabled or not.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setElementClass('item-checkbox-disabled', this._disabled);
  }

  /**
   * @private
   */
  onChange(isChecked: boolean) {
    // used when this input does not have an ngModel or formControlName
    console.debug('checkbox, onChange (no ngModel)', isChecked);
    this._setChecked(isChecked);
    this.onTouched();
  }

  /**
   * @private
   */
  onTouched() {}

  /**
   * @private
   */
  ngAfterContentInit() {
    this._init = true;
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }
}
