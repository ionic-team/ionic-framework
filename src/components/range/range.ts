import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, Optional, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { clamp, isTrueProperty } from '../../util/util';
import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { Form } from '../../util/form';
import { Haptic } from '../../tap-click/haptic';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';
import { Platform } from '../../platform/platform';
import { PointerCoordinates, pointerCoord } from '../../util/dom';
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
@Component({
  selector: 'ion-range',
  template:
    '<ng-content select="[range-left]"></ng-content>' +
    '<div class="range-slider" #slider>' +
      '<div class="range-tick" *ngFor="let t of _ticks" [style.left]="t.left" [class.range-tick-active]="t.active" role="presentation"></div>' +
      '<div class="range-bar" role="presentation"></div>' +
      '<div class="range-bar range-bar-active" [style.left]="_barL" [style.right]="_barR" #bar role="presentation"></div>' +
      '<div class="range-knob-handle" (ionIncrease)="_keyChg(true, false)" (ionDecrease)="_keyChg(false, false)" [ratio]="_ratioA" [val]="_valA" [pin]="_pin" [pressed]="_pressedA" [min]="_min" [max]="_max" [disabled]="_disabled" [labelId]="_labelId"></div>' +
      '<div class="range-knob-handle" (ionIncrease)="_keyChg(true, true)" (ionDecrease)="_keyChg(false, true)" [ratio]="_ratioB" [val]="_valB" [pin]="_pin" [pressed]="_pressedB" [min]="_min" [max]="_max" [disabled]="_disabled" [labelId]="_labelId" *ngIf="_dual"></div>' +
    '</div>' +
    '<ng-content select="[range-right]"></ng-content>',
  host: {
    '[class.range-disabled]': '_disabled',
    '[class.range-pressed]': '_pressed',
    '[class.range-has-pin]': '_pin'
  },
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: Range, multi: true } ],
  encapsulation: ViewEncapsulation.None,
})
export class Range extends BaseInput<any> implements AfterContentInit, ControlValueAccessor, OnDestroy {

  _dual: boolean;
  _pin: boolean;
  _pressed: boolean;

  _activeB: boolean;
  _rect: ClientRect;
  _ticks: any[];

  _min = 0;
  _max = 100;
  _step = 1;
  _snaps: boolean;

  _valA = 0;
  _valB = 0;

  _ratioA = 0;
  _ratioB = 0;

  _pressedA: boolean;
  _pressedB: boolean;

  _barL: string;
  _barR: string;

  _events: UIEventManager;

  @ViewChild('slider') public _slider: ElementRef;

  /**
   * @input {number} Minimum integer value of the range. Defaults to `0`.
   */
  @Input()
  get min(): number {
    return this._min;
  }
  set min(val: number) {
    val = Math.round(val);
    if (!isNaN(val)) {
      this._min = val;
      this._inputUpdated();
    }
  }

  /**
   * @input {number} Maximum integer value of the range. Defaults to `100`.
   */
  @Input()
  get max(): number {
    return this._max;
  }
  set max(val: number) {
    val = Math.round(val);
    if (!isNaN(val)) {
      this._max = val;
      this._inputUpdated();
    }
  }

  /**
   * @input {number} Specifies the value granularity. Defaults to `1`.
   */
  @Input()
  get step(): number {
    return this._step;
  }
  set step(val: number) {
    val = Math.round(val);
    if (!isNaN(val) && val > 0) {
      this._step = val;
    }
  }

  /**
   * @input {boolean} If true, the knob snaps to tick marks evenly spaced based
   * on the step property value. Defaults to `false`.
   */
  @Input()
  get snaps(): boolean {
    return this._snaps;
  }
  set snaps(val: boolean) {
    this._snaps = isTrueProperty(val);
  }

  /**
   * @input {boolean} If true, a pin with integer value is shown when the knob
   * is pressed. Defaults to `false`.
   */
  @Input()
  get pin(): boolean {
    return this._pin;
  }
  set pin(val: boolean) {
    this._pin = isTrueProperty(val);
  }

  /**
   * @input {number} How long, in milliseconds, to wait to trigger the
   * `ionChange` event after each change in the range value. Default `0`.
   */
  @Input()
  get debounce(): number {
    return this._debouncer.wait;
  }
  set debounce(val: number) {
    this._debouncer.wait = val;
  }

  /**
   * @input {boolean} Show two knobs. Defaults to `false`.
   */
  @Input()
  get dualKnobs(): boolean {
    return this._dual;
  }
  set dualKnobs(val: boolean) {
    this._dual = isTrueProperty(val);
  }

  /**
   * Returns the ratio of the knob's is current location, which is a number
   * between `0` and `1`. If two knobs are used, this property represents
   * the lower value.
   */
  get ratio(): number {
    if (this._dual) {
      return Math.min(this._ratioA, this._ratioB);
    }
    return this._ratioA;
  }

  /**
   * Returns the ratio of the upper value's is current location, which is
   * a number between `0` and `1`. If there is only one knob, then this
   * will return `null`.
   */
  get ratioUpper(): number {
    if (this._dual) {
      return Math.max(this._ratioA, this._ratioB);
    }
    return null;
  }

  constructor(
    form: Form,
    private _haptic: Haptic,
    @Optional() item: Item,
    config: Config,
    private _plt: Platform,
    elementRef: ElementRef,
    renderer: Renderer,
    private _dom: DomController,
    private _cd: ChangeDetectorRef
  ) {
    super(config, elementRef, renderer, 'range', 0, form, item, null);
    this._events = new UIEventManager(_plt);
  }

  /**
   * @hidden
   */
  ngAfterContentInit() {
    this._initialize();

    // add touchstart/mousedown listeners
    this._events.pointerEvents({
      element: this._slider.nativeElement,
      pointerDown: this._pointerDown.bind(this),
      pointerMove: this._pointerMove.bind(this),
      pointerUp: this._pointerUp.bind(this),
      zone: true
    });

    // build all the ticks if there are any to show
    this._createTicks();
  }

  /** @internal */
  _pointerDown(ev: UIEvent): boolean {
    // TODO: we could stop listening for events instead of checking this._disabled.
    // since there are a lot of events involved, this solution is
    // enough for the moment
    if (this._disabled) {
      return false;
    }

    // trigger ionFocus event
    this._fireFocus();

    // prevent default so scrolling does not happen
    ev.preventDefault();
    ev.stopPropagation();

    // get the start coordinates
    const current = pointerCoord(ev);

    // get the full dimensions of the slider element
    const rect = this._rect = this._plt.getElementBoundingClientRect(this._slider.nativeElement);

    // figure out which knob they started closer to
    const ratio = clamp(0, (current.x - rect.left) / (rect.width), 1);
    this._activeB = this._dual && (Math.abs(ratio - this._ratioA) > Math.abs(ratio - this._ratioB));

    // update the active knob's position
    this._update(current, rect, true);

    // trigger a haptic start
    this._haptic.gestureSelectionStart();

    // return true so the pointer events
    // know everything's still valid
    return true;
  }

  /** @internal */
  _pointerMove(ev: UIEvent) {
    if (this._disabled) {
      return;
    }
    // prevent default so scrolling does not happen
    ev.preventDefault();
    ev.stopPropagation();

    // update the active knob's position
    const hasChanged = this._update(pointerCoord(ev), this._rect, true);

    if (hasChanged && this._snaps) {
      // trigger a haptic selection changed event
      // if this is a snap range
      this._haptic.gestureSelectionChanged();
    }
  }

  /** @internal */
  _pointerUp(ev: UIEvent) {
    if (this._disabled) {
      return;
    }
    // prevent default so scrolling does not happen
    ev.preventDefault();
    ev.stopPropagation();

    // update the active knob's position
    this._update(pointerCoord(ev), this._rect, false);

    // trigger a haptic end
    this._haptic.gestureSelectionEnd();

    // trigger ionBlur event
    this._fireBlur();
  }

  /** @internal */
  _update(current: PointerCoordinates, rect: ClientRect, isPressed: boolean) {
    // figure out where the pointer is currently at
    // update the knob being interacted with
    let ratio = clamp(0, (current.x - rect.left) / (rect.width), 1);
    let val = this._ratioToValue(ratio);

    if (this._snaps) {
      // snaps the ratio to the current value
      ratio = this._valueToRatio(val);
    }

    // update which knob is pressed
    this._pressed = isPressed;
    let valChanged = false;
    if (this._activeB) {
      // when the pointer down started it was determined
      // that knob B was the one they were interacting with
      this._pressedB = isPressed;
      this._pressedA = false;
      this._ratioB = ratio;
      valChanged = val === this._valB;
      this._valB = val;

    } else {
      // interacting with knob A
      this._pressedA = isPressed;
      this._pressedB = false;
      this._ratioA = ratio;
      valChanged = val === this._valA;
      this._valA = val;
    }
    this._updateBar();
    if (valChanged) {
      return false;
    }

    // value has been updated
    let value;
    if (this._dual) {
      // dual knobs have an lower and upper value
      value = {
        lower: Math.min(this._valA, this._valB),
        upper: Math.max(this._valA, this._valB)
      };

      console.debug(`range, updateKnob: ${ratio}, lower: ${this.value.lower}, upper: ${this.value.upper}`);

    } else {
      // single knob only has one value
      value = this._valA;
      console.debug(`range, updateKnob: ${ratio}, value: ${this.value}`);
    }

    // Update input value
    this.value = value;

    return true;
  }

  /** @internal */
  _updateBar() {
    const ratioA = this._ratioA;
    const ratioB = this._ratioB;

    if (this._dual) {
      this._barL = `${(Math.min(ratioA, ratioB) * 100)}%`;
      this._barR = `${100 - (Math.max(ratioA, ratioB) * 100)}%`;

    } else {
      this._barL = '';
      this._barR = `${100 - (ratioA * 100)}%`;
    }

    this._updateTicks();
  }

  /** @internal */
  _createTicks() {
    if (this._snaps) {
      this._dom.write(() => {
        // TODO: Fix to not use RAF
        this._ticks = [];
        for (var value = this._min; value <= this._max; value += this._step) {
          var ratio = this._valueToRatio(value);
          this._ticks.push({
            ratio: ratio,
            left: `${ratio * 100}%`,
          });
        }
        this._updateTicks();
      });
    }
  }

  /** @internal */
  _updateTicks() {
    const ticks = this._ticks;
    const ratio = this.ratio;

    if (this._snaps && ticks) {
      if (this._dual) {
        var upperRatio = this.ratioUpper;

        ticks.forEach(t => {
          t.active = (t.ratio >= ratio && t.ratio <= upperRatio);
        });

      } else {
        ticks.forEach(t => {
          t.active = (t.ratio <= ratio);
        });
      }
    }
  }

  /** @hidden */
  _keyChg(isIncrease: boolean, isKnobB: boolean) {
    const step = this._step;
    if (isKnobB) {
      if (isIncrease) {
        this._valB += step;
      } else {
        this._valB -= step;
      }
      this._valB = clamp(this._min, this._valB, this._max);
      this._ratioB = this._valueToRatio(this._valB);

    } else {
      if (isIncrease) {
        this._valA += step;
      } else {
        this._valA -= step;
      }
      this._valA = clamp(this._min, this._valA, this._max);
      this._ratioA = this._valueToRatio(this._valA);
    }
    this._updateBar();
  }

  /** @internal */
  _ratioToValue(ratio: number) {
    ratio = Math.round(((this._max - this._min) * ratio));
    ratio = Math.round(ratio / this._step) * this._step + this._min;
    return clamp(this._min, ratio, this._max);
  }

  /** @internal */
  _valueToRatio(value: number) {
    value = Math.round((value - this._min) / this._step) * this._step;
    value = value / (this._max - this._min);
    return clamp(0, value, 1);
  }

  _inputNormalize(val: any): any {
    if (this._dual) {
      return val;
    } else {
      val = parseFloat(val);
      return isNaN(val) ? undefined : val;
    }
  }

  /**
   * @hidden
   */
  _inputUpdated() {
    const val = this.value;
    if (this._dual) {
      this._valA = val.lower;
      this._valB = val.upper;
      this._ratioA = this._valueToRatio(val.lower);
      this._ratioB = this._valueToRatio(val.upper);

    } else {
      this._valA = val;
      this._ratioA = this._valueToRatio(val);
    }

    this._updateBar();
    this._cd.detectChanges();
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    this._events.destroy();
  }
}
