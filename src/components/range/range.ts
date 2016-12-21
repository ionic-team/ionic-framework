import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, Optional, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { clamp, isPresent, isTrueProperty } from '../../util/util';
import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { Form } from '../../util/form';
import { Haptic } from '../../tap-click/haptic';
import { Ion } from '../ion';
import { Item } from '../item/item';
import { Platform } from '../../platform/platform';
import { PointerCoordinates, pointerCoord } from '../../util/dom';
import { TimeoutDebouncer } from '../../util/debouncer';
import { UIEventManager } from '../../gestures/ui-event-manager';


export const RANGE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Range),
  multi: true
};


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
 * @demo /docs/v2/demos/src/range/
 */
@Component({
  selector: 'ion-range',
  template:
    '<ng-content select="[range-left]"></ng-content>' +
    '<div class="range-slider" #slider>' +
      '<div class="range-tick" *ngFor="let t of _ticks" [style.left]="t.left" [class.range-tick-active]="t.active"></div>' +
      '<div class="range-bar"></div>' +
      '<div class="range-bar range-bar-active" [style.left]="_barL" [style.right]="_barR" #bar></div>' +
      '<div class="range-knob-handle" [ratio]="_lowerRatio" [val]="_lowerVal" [pin]="_pin" [min]="_min" [max]="_max" [pressed]="_lowerPressed"></div>' +
      '<div class="range-knob-handle" [ratio]="_upperRatio" [val]="_upperVal" [pin]="_pin" [min]="_min" [max]="_max" [pressed]="_upperPressed" *ngIf="_dual"></div>' +
    '</div>' +
    '<ng-content select="[range-right]"></ng-content>',
  host: {
    '[class.range-disabled]': '_disabled',
    '[class.range-pressed]': '_pressed',
    '[class.range-has-pin]': '_pin'
  },
  providers: [RANGE_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
})
export class Range extends Ion implements AfterViewInit, ControlValueAccessor, OnDestroy {
  _dual: boolean;
  _pin: boolean;
  _disabled: boolean;
  _pressed: boolean = false;
  _labelId: string;
  _fn: Function;

  _start: PointerCoordinates;
  _rect: ClientRect;
  _ticks: any[];

  _min: number = 0;
  _max: number = 100;
  _step: number = 1;
  _snaps: boolean;

  _lowerVal: number;
  _upperVal: number;

  _lowerRatio: number;
  _upperRatio: number;

  _lowerPressed: boolean;
  _upperPressed: boolean;

  _barL: string;
  _barR: string;

  _debouncer: TimeoutDebouncer = new TimeoutDebouncer(0);
  _events: UIEventManager;

  @ViewChild('bar') public _bar: ElementRef;
  @ViewChild('slider') public _slider: ElementRef;

  /**
   * @private
   */
  value: any;

  /**
   * @input {string} The predefined color to use. For example: `"primary"`,
   * `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor(val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode(val);
  }

  /**
   * @private
   */
  id: string;

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
   * @input {number} If true, the knob snaps to tick marks evenly spaced based
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
   * @input {number} If true, a pin with integer value is shown when the knob
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
   * @output {Range} Expression to evaluate when the range value changes.
   */
  @Output() ionChange: EventEmitter<Range> = new EventEmitter<Range>();


  constructor(
    private _form: Form,
    private _haptic: Haptic,
    @Optional() private _item: Item,
    config: Config,
    platform: Platform,
    elementRef: ElementRef,
    renderer: Renderer,
    private _dom: DomController
  ) {
    super(config, elementRef, renderer, 'range');
    this._events = new UIEventManager(platform);
    _form.register(this);

    if (_item) {
      this.id = 'rng-' + _item.registerInput('range');
      this._labelId = 'lbl-' + _item.id;
      _item.setElementClass('item-range', true);
    }
  }

  /**
   * @private
   */
  ngAfterViewInit() {
    let barL = '';
    let barR = '';

    const firstRatio = this._lowerRatio;
    const lastRatio = this._upperRatio;

    if (this._dual) {
      barL = `${(Math.min(firstRatio, lastRatio) * 100)}%`;
      barR = `${100 - (Math.max(firstRatio, lastRatio) * 100)}%`;

    } else {
      barR = `${100 - (firstRatio * 100)}%`;
    }

    // set the left/right of the highlight bar
    this._renderer.setElementStyle(this._bar.nativeElement, 'left', barL);
    this._renderer.setElementStyle(this._bar.nativeElement, 'right', barR);

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
    console.debug(`range, ${ev.type}`);

    // prevent default so scrolling does not happen
    ev.preventDefault();
    ev.stopPropagation();

    // get the start coordinates
    const start = this._start = pointerCoord(ev);

    // get the full dimensions of the slider element
    const rect: ClientRect = this._rect = this._slider.nativeElement.getBoundingClientRect();

    // figure out the offset
    // the start of the pointer could actually
    // have been left or right of the slider bar
    if (start.x < rect.left) {
      rect.xOffset = (start.x - rect.left);

    } else if (start.x > rect.right) {
      rect.xOffset = (start.x - rect.right);

    } else {
      rect.xOffset = 0;
    }

    // update the active knob's position
    this._update(start, rect, true);

    this._haptic.gestureSelectionStart();

    return true;
  }

  /** @internal */
  _pointerMove(ev: UIEvent) {
    console.debug(`range, ${ev.type}`);

    // prevent default so scrolling does not happen
    ev.preventDefault();
    ev.stopPropagation();

    // update the active knob's position
    this._update(pointerCoord(ev), this._rect, true);
  }

  /** @internal */
  _pointerUp(ev: UIEvent) {
    if (!this._disabled) {
      console.debug(`range, ${ev.type}`);

      // prevent default so scrolling does not happen
      ev.preventDefault();
      ev.stopPropagation();

      // update the active knob's position
      this._update(pointerCoord(ev), this._rect, false);

      this._haptic.gestureSelectionEnd();
    }

    // clear the start coordinates and active knob
    this._start = null;
  }

  /** @internal */
  _update(current: PointerCoordinates, rect: ClientRect, isPressed: boolean) {
    // update which knob is pressed
    this._pressed = isPressed;

    // figure out where the pointer is currently at
    // update the knob being interacted with
    let ratio = clamp(0, (current.x - rect.left) / (rect.width), 1);
    let val = this._ratioToValue(ratio);

    if (this._snaps) {
      ratio = this._valueToRatio(val);
    }

    if (this._dual && Math.abs(ratio - this._lowerRatio) > Math.abs(ratio - this._upperRatio)) {
      // upper knob
      this._upperRatio = ratio;
      this._upperVal = val;
      this._upperPressed = isPressed;
      this._lowerPressed = false;

    } else {
      // lower knob
      this._lowerRatio = ratio;
      this._lowerVal = val;
      this._lowerPressed = isPressed;
      this._upperPressed = false;
    }

    // value has been updated
    if (this._dual) {
      if (!this.value) {
        this.value = {};
      }
      this.value.lower = Math.min(this._lowerVal, this._upperVal);
      this.value.upper = Math.max(this._lowerVal, this._upperVal);

      console.debug(`range, updateKnob: ${ratio}, lower: ${this.value.lower}, upper: ${this.value.upper}`);

    } else {
      this.value = this._lowerVal;
      console.debug(`range, updateKnob: ${ratio}, value: ${this.value}`);
    }

    this._debouncer.debounce(() => {
      this.onChange(this.value);
      this.ionChange.emit(this);
    });

    // trigger a haptic selection changed event
    // if this is a snap range
    if (this.snaps) {
      this._haptic.gestureSelectionChanged();
    }

    this._updateBar();
  }

  /** @internal */
  _updateBar() {
    const firstRatio = this._lowerRatio;
    const lastRatio = this._upperRatio;

    if (this._dual) {
      this._barL = `${(Math.min(firstRatio, lastRatio) * 100)}%`;
      this._barR = `${100 - (Math.max(firstRatio, lastRatio) * 100)}%`;

    } else {
      this._barL = '';
      this._barR = `${100 - (firstRatio * 100)}%`;
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

  /**
   * @private
   */
  writeValue(val: any) {
    if (isPresent(val)) {
      this.value = val;

      if (this._dual) {
        this._lowerVal = val.lower;
        this._upperVal = val.upper;
        this._lowerRatio = this._valueToRatio(val.lower);
        this._upperRatio = this._valueToRatio(val.upper);

      } else {
        this._lowerVal = val;
        this._lowerRatio = this._valueToRatio(val);
      }

      this._updateBar();
    }
  }

  /**
   * @private
   */
  registerOnChange(fn: Function): void {
    this._fn = fn;
    this.onChange = (val: any) => {
      fn(val);
      this.onTouched();
    };
  }

  /**
   * @private
   */
  registerOnTouched(fn: any) { this.onTouched = fn; }

  /**
   * @input {boolean} Whether or not the range is disabled. Defaults to `false`.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setElementClass('item-range-disabled', this._disabled);
  }

  /**
   * Returns the ratio of the knob's is current location, which is a number
   * between `0` and `1`. If two knobs are used, this property represents
   * the lower value.
   */
  get ratio(): number {
    if (this._dual) {
      return Math.min(this._lowerRatio, this._upperRatio);
    }
    return this._lowerRatio;
  }

  /**
   * Returns the ratio of the upper value's is current location, which is
   * a number between `0` and `1`. If there is only one knob, then this
   * will return `null`.
   */
  get ratioUpper(): number {
    if (this._dual) {
      return Math.max(this._lowerRatio, this._upperRatio);
    }
    return null;
  }

  /**
   * @private
   */
  onChange(val: any) {
    // used when this input does not have an ngModel or formControlName
    this.onTouched();
  }

  /**
   * @private
   */
  onTouched() { }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
    this._events.destroy();
  }
}


export interface ClientRect {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  width?: number;
  height?: number;
  xOffset?: number;
  yOffset?: number;
}
