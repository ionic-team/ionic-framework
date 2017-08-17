import { ChangeDetectorRef, ElementRef, EventEmitter, Renderer } from '@angular/core';
import { RadioButton } from './radio-button';
/**
 * @name RadioGroup
 * @description
 * A radio group is a group of [radio buttons](../RadioButton). It allows
 * a user to select at most one radio button from a set. Checking one radio
 * button that belongs to a radio group unchecks any previous checked
 * radio button within the same group.
 *
 * See the [Angular Forms Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more information on forms and inputs.
 *
 * @usage
 * ```html
 * <ion-list radio-group [(ngModel)]="autoManufacturers">
 *
 *   <ion-list-header>
 *     Auto Manufacturers
 *   </ion-list-header>
 *
 *   <ion-item>
 *     <ion-label>Cord</ion-label>
 *     <ion-radio value="cord"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Duesenberg</ion-label>
 *     <ion-radio value="duesenberg"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Hudson</ion-label>
 *     <ion-radio value="hudson"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Packard</ion-label>
 *     <ion-radio value="packard"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Studebaker</ion-label>
 *     <ion-radio value="studebaker"></ion-radio>
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 * @demo /docs/demos/src/radio/
 * @see {@link /docs/components#radio Radio Component Docs}
 * @see {@link ../RadioButton RadioButton API Docs}
*/
export declare class RadioGroup {
    private _renderer;
    private _elementRef;
    private _cd;
    /**
     * @internal
     */
    _disabled: boolean;
    /**
     * @hidden
     */
    _btns: RadioButton[];
    /**
     * @hidden
     */
    _fn: Function;
    /**
     * @hidden
     */
    _ids: number;
    /**
     * @hidden
     */
    _init: boolean;
    /**
     * @hidden
     */
    value: any;
    /**
     * @hidden
     */
    id: number;
    /**
     * @input {boolean} If true, the user cannot interact with any of the buttons in the group.
     */
    disabled: boolean;
    /**
     * @output {any} Emitted when the selected button has changed.
     */
    ionChange: EventEmitter<RadioGroup>;
    constructor(_renderer: Renderer, _elementRef: ElementRef, _cd: ChangeDetectorRef);
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    /**
     * @hidden
     */
    writeValue(val: any): void;
    /**
     * @hidden
     */
    registerOnChange(fn: Function): void;
    /**
     * @hidden
     */
    registerOnTouched(fn: any): void;
    /**
     * @hidden
     */
    _update(): void;
    /**
     * @hidden
     */
    _setActive(radioButton: RadioButton): void;
    /**
     * @hidden
     */
    add(button: RadioButton): string;
    /**
     * @hidden
     */
    remove(button: RadioButton): void;
    /**
     * @hidden
     */
    _header: any;
    /**
     * @hidden
     */
    onChange(val: any): void;
    /**
     * @hidden
     */
    onTouched(): void;
    /**
     * @hidden
     */
    setDisabledState(isDisabled: boolean): void;
}
