import { AfterContentInit, ElementRef, NgZone, OnDestroy, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { Form, IonicTapInput } from '../../util/form';
import { GestureController } from '../../gestures/gesture-controller';
import { Haptic } from '../../tap-click/haptic';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';
import { Platform } from '../../platform/platform';
import { ToggleGesture } from './toggle-gesture';
/**
 * @name Toggle
 * @description
 * A toggle technically is the same thing as an HTML checkbox input,
 * except it looks different and is easier to use on a touch device.
 * Toggles can also have colors assigned to them, by adding any color
 * attribute.
 *
 * See the [Angular Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more info on forms and inputs.
 *
 * @usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-toggle [(ngModel)]="pepperoni"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-toggle [(ngModel)]="sausage" disabled="true"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-toggle [(ngModel)]="mushrooms"></ion-toggle>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 *
 * @demo /docs/demos/src/toggle/
 * @see {@link /docs/components#toggle Toggle Component Docs}
 */
export declare class Toggle extends BaseInput<boolean> implements IonicTapInput, AfterContentInit, OnDestroy {
    private _plt;
    private _haptic;
    private _gestureCtrl;
    private _domCtrl;
    private _zone;
    _activated: boolean;
    _startX: number;
    _gesture: ToggleGesture;
    /**
     * @input {boolean} If true, the element is selected.
     */
    checked: boolean;
    constructor(form: Form, config: Config, _plt: Platform, elementRef: ElementRef, renderer: Renderer, _haptic: Haptic, item: Item, _gestureCtrl: GestureController, _domCtrl: DomController, _zone: NgZone);
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    /**
     * @hidden
     */
    _inputUpdated(): void;
    /**
     * @hidden
     */
    _inputNormalize(val: any): boolean;
    /**
     * @hidden
     */
    _onDragStart(startX: number): void;
    /**
     * @hidden
     */
    _onDragMove(currentX: number): void;
    /**
     * @hidden
     */
    _onDragEnd(endX: number): void;
    /**
     * @hidden
     */
    _shouldToggle(currentX: number, margin: number): boolean;
    /**
     * @hidden
     */
    _keyup(ev: KeyboardEvent): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
}
