import { Component, ElementRef, HostListener, Input, OnDestroy, Optional, Renderer, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { Config } from '../../config/config';
import { isTrueProperty } from '../../util/util';
import { Form, IonicTapInput } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';

/**
 * @name Checkbox
 * @module ionic
 *
 * @description
 * The Checkbox is a simple component styled based on the mode. It can be
 * placed in an `ion-item` or used as a stand-alone checkbox.
 *
 * See the [Angular Docs](https://angular.io/docs/ts/latest/guide/forms.html)
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
 * @advanced
 *
 * ```html
 *
 * <!-- Call function when state changes -->
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Cucumber</ion-label>
 *      <ion-checkbox [(ngModel)]="cucumber" (ionChange)="updateCucumber()"></ion-checkbox>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 *
 * ```ts
 * @Component({
 *   templateUrl: 'main.html'
 * })
 * class SaladPage {
 *   cucumber: boolean;
 *
 *   updateCucumber() {
 *     console.log('Cucumbers new state:' + this.cucumber);
 *   }
 * }
 * ```
 *
 * @demo /docs/demos/src/checkbox/
 * @see {@link /docs/components#checkbox Checkbox Component Docs}
 */
@Component({
  selector: 'ion-checkbox',
  template:
    '<div class="checkbox-icon" [class.checkbox-checked]="_value">' +
      '<div class="checkbox-inner"></div>' +
    '</div>' +
    '<button role="checkbox" ' +
            'type="button" ' +
            'ion-button="item-cover" ' +
            '[id]="id" ' +
            '[attr.aria-checked]="_value" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover"> ' +
    '</button>',
  host: {
    '[class.checkbox-disabled]': '_disabled'
  },
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: Checkbox, multi: true } ],
  encapsulation: ViewEncapsulation.None,
})
export class Checkbox extends BaseInput<boolean> implements IonicTapInput, OnDestroy {

  /**
   * @input {boolean} If true, the element is selected.
   */
  @Input()
  get checked(): boolean {
    return this.value;
  }

  set checked(val: boolean) {
    this.value = val;
  }

  constructor(
    config: Config,
    form: Form,
    @Optional() item: Item,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    super(config, elementRef, renderer, 'checkbox', false, form, item, null);
  }

  /**
   * @hidden
   */
  @HostListener('click', ['$event'])
  _click(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.value = !this.value;
    this._fireTouched();
  }

  /**
   * @hidden
   */
  _inputNormalize(val: any): boolean {
    return isTrueProperty(val);
  }

  /**
   * @hidden
   */
  _inputUpdated() {
    this._item && this._item.setElementClass('item-checkbox-checked', this._value);
  }
}
