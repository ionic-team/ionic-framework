import { ElementRef, EventEmitter, OnDestroy, OnInit, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Form, IonicTapInput } from '../../util/form';
import { Ion } from '../ion';
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
export declare class RadioButton extends Ion implements IonicTapInput, OnDestroy, OnInit {
    private _form;
    private _item;
    private _group;
    /**
     * @internal
     */
    _checked: boolean;
    /**
     * @internal
     */
    _disabled: boolean;
    /**
     * @internal
     */
    _labelId: string;
    /**
     * @internal
     */
    _value: any;
    /**
     * @internal
     */
    id: string;
    /**
     * @input {string} The color to use from your Sass `$colors` map.
     * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
     * For more information, see [Theming your App](/docs/theming/theming-your-app).
     */
    color: string;
    /**
     * @output {any} Emitted when the radio button is selected.
     */
    ionSelect: EventEmitter<any>;
    constructor(_form: Form, config: Config, elementRef: ElementRef, renderer: Renderer, _item: Item, _group: RadioGroup);
    /**
     * @input {any} The value of the radio button. Defaults to the generated id.
     */
    value: any;
    /**
     * @input {boolean} If true, the element is selected, and other buttons in the group are unselected.
     */
    checked: boolean;
    /**
     * @input {boolean} If true, the user cannot interact with this element.
     */
    disabled: boolean;
    /**
     * @hidden
     */
    initFocus(): void;
    /**
     * @internal
     */
    _click(ev: UIEvent): void;
    /**
     * @internal
     */
    ngOnInit(): void;
    /**
     * @internal
     */
    ngOnDestroy(): void;
}
