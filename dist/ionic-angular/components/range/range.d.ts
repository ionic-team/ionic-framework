import { AfterContentInit, ChangeDetectorRef, ElementRef, OnDestroy, Renderer } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { Form } from '../../util/form';
import { Haptic } from '../../tap-click/haptic';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';
import { Platform } from '../../platform/platform';
import { PointerCoordinates } from '../../util/dom';
import { UIEventManager } from '../../gestures/ui-event-manager';
/**
 * @name Range
 * @description
 * The Range slider lets users select from a range of values by moving
 * the slider knob. It can accept dual knobs, but by default one knob
 * controls the value of the range.
 *
 * ### Range Labels
 * Labels can be placed on either side of the range by adding the
 * `range-left` or `range-right` property to the element. The element
 * doesn't have to be an `ion-label`, it can be added to any element
 * to place it to the left or right of the range. See [usage](#usage)
 * below for examples.
 *
 *
 * ### Minimum and Maximum Values
 * Minimum and maximum values can be passed to the range through the `min`
 * and `max` properties, respectively. By default, the range sets the `min`
 * to `0` and the `max` to `100`.
 *
 *
 * ### Steps and Snaps
 * The `step` property specifies the value granularity of the range's value.
 * It can be useful to set the `step` when the value isn't in increments of `1`.
 * Setting the `step` property will show tick marks on the range for each step.
 * The `snaps` property can be set to automatically move the knob to the nearest
 * tick mark based on the step property value.
 *
 *
 * ### Dual Knobs
 * Setting the `dualKnobs` property to `true` on the range component will
 * enable two knobs on the range. If the range has two knobs, the value will
 * be an object containing two properties: `lower` and `upper`.
 *
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item>
 *     <ion-range [(ngModel)]="singleValue" color="danger" pin="true"></ion-range>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-range min="-200" max="200" [(ngModel)]="saturation" color="secondary">
 *       <ion-label range-left>-200</ion-label>
 *       <ion-label range-right>200</ion-label>
 *     </ion-range>
 *   </ion-item>
 *
 *  <ion-item>
 *    <ion-range min="20" max="80" step="2" [(ngModel)]="brightness">
 *      <ion-icon small range-left name="sunny"></ion-icon>
 *      <ion-icon range-right name="sunny"></ion-icon>
 *    </ion-range>
 *  </ion-item>
 *
 *   <ion-item>
 *     <ion-label>step=100, snaps, {{singleValue4}}</ion-label>
 *     <ion-range min="1000" max="2000" step="100" snaps="true" color="secondary" [(ngModel)]="singleValue4"></ion-range>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>dual, step=3, snaps, {{dualValue2 | json}}</ion-label>
 *     <ion-range dualKnobs="true" [(ngModel)]="dualValue2" min="21" max="72" step="3" snaps="true"></ion-range>
 *   </ion-item>
 * </ion-list>
 * ```
 *
 *
 * @demo /docs/demos/src/range/
 */
export declare class Range extends BaseInput<any> implements AfterContentInit, ControlValueAccessor, OnDestroy {
    private _haptic;
    private _plt;
    private _dom;
    private _cd;
    _dual: boolean;
    _pin: boolean;
    _pressed: boolean;
    _activeB: boolean;
    _rect: ClientRect;
    _ticks: any[];
    _min: number;
    _max: number;
    _step: number;
    _snaps: boolean;
    _valA: number;
    _valB: number;
    _ratioA: number;
    _ratioB: number;
    _pressedA: boolean;
    _pressedB: boolean;
    _barL: string;
    _barR: string;
    _events: UIEventManager;
    _slider: ElementRef;
    /**
     * @input {number} Minimum integer value of the range. Defaults to `0`.
     */
    min: number;
    /**
     * @input {number} Maximum integer value of the range. Defaults to `100`.
     */
    max: number;
    /**
     * @input {number} Specifies the value granularity. Defaults to `1`.
     */
    step: number;
    /**
     * @input {boolean} If true, the knob snaps to tick marks evenly spaced based
     * on the step property value. Defaults to `false`.
     */
    snaps: boolean;
    /**
     * @input {boolean} If true, a pin with integer value is shown when the knob
     * is pressed. Defaults to `false`.
     */
    pin: boolean;
    /**
     * @input {number} How long, in milliseconds, to wait to trigger the
     * `ionChange` event after each change in the range value. Default `0`.
     */
    debounce: number;
    /**
     * @input {boolean} Show two knobs. Defaults to `false`.
     */
    dualKnobs: boolean;
    /**
     * Returns the ratio of the knob's is current location, which is a number
     * between `0` and `1`. If two knobs are used, this property represents
     * the lower value.
     */
    readonly ratio: number;
    /**
     * Returns the ratio of the upper value's is current location, which is
     * a number between `0` and `1`. If there is only one knob, then this
     * will return `null`.
     */
    readonly ratioUpper: number;
    constructor(form: Form, _haptic: Haptic, item: Item, config: Config, _plt: Platform, elementRef: ElementRef, renderer: Renderer, _dom: DomController, _cd: ChangeDetectorRef);
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    /** @internal */
    _pointerDown(ev: UIEvent): boolean;
    /** @internal */
    _pointerMove(ev: UIEvent): void;
    /** @internal */
    _pointerUp(ev: UIEvent): void;
    /** @internal */
    _update(current: PointerCoordinates, rect: ClientRect, isPressed: boolean): boolean;
    /** @internal */
    _updateBar(): void;
    /** @internal */
    _createTicks(): void;
    /** @internal */
    _updateTicks(): void;
    /** @hidden */
    _keyChg(isIncrease: boolean, isKnobB: boolean): void;
    /** @internal */
    _ratioToValue(ratio: number): number;
    /** @internal */
    _valueToRatio(value: number): number;
    _inputNormalize(val: any): any;
    /**
     * @hidden
     */
    _inputUpdated(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
}
