import { ElementRef, OnDestroy, Renderer } from '@angular/core';
import { Config } from '../../config/config';
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
export declare class Checkbox extends BaseInput<boolean> implements IonicTapInput, OnDestroy {
    /**
     * @input {boolean} If true, the element is selected.
     */
    checked: boolean;
    constructor(config: Config, form: Form, item: Item, elementRef: ElementRef, renderer: Renderer);
    /**
     * @hidden
     */
    _click(ev: UIEvent): void;
    /**
     * @hidden
     */
    _inputNormalize(val: any): boolean;
    /**
     * @hidden
     */
    _inputUpdated(): void;
}
