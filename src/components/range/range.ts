import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, Inject, OnDestroy, OnInit, Optional, Output, QueryList, Renderer, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { clamp, isNumber, isPresent, isString, isTrueProperty } from '../../util/util';
import { Config } from '../../config/config';
import { Debouncer } from '../../util/debouncer';
import { Form } from '../../util/form';
import { Ion } from '../ion';
import { Item } from '../item/item';
import { PointerCoordinates, pointerCoord, raf } from '../../util/dom';
import { UIEventManager } from '../../util/ui-event-manager';

export const RANGE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Range),
  multi: true
};

/**
 * @private
 */
@Component({
  selector: '.range-knob-handle',
  template:
    '<div class="range-pin" *ngIf="range.pin">{{_val}}</div>' +
    '<div class="range-knob"></div>',
  host: {
    '[class.range-knob-pressed]': 'pressed',
    '[class.range-knob-min]': '_val===range.min',
    '[class.range-knob-max]': '_val===range.max',
    '[style.left]': '_x',
    '[attr.aria-valuenow]': '_val',
    '[attr.aria-valuemin]': 'range.min',
    '[attr.aria-valuemax]': 'range.max',
    'role': 'slider',
    'tabindex': '0'
  }
})
export class RangeKnob implements OnInit {
  _ratio: number;
  _val: number;
  _x: string;
  pressed: boolean;

  @Input() upper: boolean;

  constructor(@Inject(forwardRef(() => Range)) public range: Range) {}

  get ratio(): number {
    return this._ratio;
  }
  set ratio(ratio: number) {
    this._ratio = clamp(0, ratio, 1);
    this._val = this.range.ratioToValue(this._ratio);

    if (this.range.snaps) {
      this._ratio = this.range.valueToRatio(this._val);
    }
  }

  get value(): number {
    return this._val;
  }
  set value(val: number) {
    if (isString(val)) {
      val = Math.round(val);
    }
    if (isNumber(val) && !isNaN(val)) {
      this._ratio = this.range.valueToRatio(val);
      this._val = this.range.ratioToValue(this._ratio);
    }
  }

  position() {
    this._x = `${this._ratio * 100}%`;
  }

  ngOnInit() {
    if (isPresent(this.range.value)) {
      // we already have a value
      if (this.range.dualKnobs) {
        // we have a value and there are two knobs
        if (this.upper) {
          // this is the upper knob
          this.value = this.range.value.upper;

        } else {
          // this is the lower knob
          this.value = this.range.value.lower;
        }

      } else {
        // we have a value and there is only one knob
        this.value = this.range.value;
      }

    } else {
      // we do not have a value so set defaults
      this.ratio = ((this.range.dualKnobs && this.upper) ? 1 : 0);
    }

    this.position();
  }

}


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
      '<div class="range-knob-handle"></div>' +
      '<div class="range-knob-handle" [upper]="true" *ngIf="_dual"></div>' +
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
  _dual: boolean = false;
  _pin: boolean;
  _disabled: boolean = false;
  _pressed: boolean;
  _labelId: string;
  _fn: Function;

  _active: RangeKnob;
  _start: PointerCoordinates = null;
  _rect: ClientRect;
  _ticks: any[];
  _barL: string;
  _barR: string;

  _min: number = 0;
  _max: number = 100;
  _step: number = 1;
  _snaps: boolean = false;

  _debouncer: Debouncer = new Debouncer(0);
  _events: UIEventManager = new UIEventManager();
  /**
   * @private
   */
  value: any;

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor('range', val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('range', val);
  }

  @ViewChild('bar') public _bar: ElementRef;
  @ViewChild('slider') public _slider: ElementRef;
  @ViewChildren(RangeKnob) public _knobs: QueryList<RangeKnob>;

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
   * @input {number} If true, the knob snaps to tick marks evenly spaced based on the step property value. Defaults to `false`.
   */
  @Input()
  get snaps(): boolean {
    return this._snaps;
  }
  set snaps(val: boolean) {
    this._snaps = isTrueProperty(val);
  }

  /**
   * @input {number} If true, a pin with integer value is shown when the knob is pressed. Defaults to `false`.
   */
  @Input()
  get pin(): boolean {
    return this._pin;
  }
  set pin(val: boolean) {
    this._pin = isTrueProperty(val);
  }

  /**
   * @input {number} How long, in milliseconds, to wait to trigger the `ionChange`
   * event after each change in the range value. Default `0`.
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
    @Optional() private _item: Item,
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    super(config, elementRef, renderer);

    this.mode = config.get('mode');
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

    let firstRatio = this._knobs.first.ratio;

    if (this._dual) {
      let lastRatio = this._knobs.last.ratio;
      barL = `${(Math.min(firstRatio, lastRatio) * 100)}%`;
      barR = `${100 - (Math.max(firstRatio, lastRatio) * 100)}%`;

    } else {
      barR = `${100 - (firstRatio * 100)}%`;
    }

    this._renderer.setElementStyle(this._bar.nativeElement, 'left', barL);
    this._renderer.setElementStyle(this._bar.nativeElement, 'right', barR);

    // add touchstart/mousedown listeners
    this._events.pointerEvents({
      elementRef: this._slider,
      pointerDown: this.pointerDown.bind(this),
      pointerMove: this.pointerMove.bind(this),
      pointerUp: this.pointerUp.bind(this)
    });
    this.createTicks();
  }

  /**
   * @private
   */
  pointerDown(ev: UIEvent): boolean {
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
    this._start = pointerCoord(ev);

    // get the full dimensions of the slider element
    let rect: ClientRect = this._rect = this._slider.nativeElement.getBoundingClientRect();

    // figure out the offset
    // the start of the pointer could actually
    // have been left or right of the slider bar
    if (this._start.x < rect.left) {
      rect.xOffset = (this._start.x - rect.left);

    } else if (this._start.x > rect.right) {
      rect.xOffset = (this._start.x - rect.right);

    } else {
      rect.xOffset = 0;
    }

    // figure out which knob we're interacting with
    this.setActiveKnob(this._start, rect);

    // update the ratio for the active knob
    this.updateKnob(this._start, rect);

    // update the active knob's position
    this._active.position();
    this._pressed = this._active.pressed = true;

    return true;
  }

  /**
   * @private
   */
  pointerMove(ev: UIEvent) {
    console.debug(`range, ${ev.type}`);

    // prevent default so scrolling does not happen
    ev.preventDefault();
    ev.stopPropagation();

    // update the ratio for the active knob
    this.updateKnob(pointerCoord(ev), this._rect);

    // update the active knob's position
    this._active.position();
    this._pressed = this._active.pressed = true;
  }

  /**
   * @private
   */
  pointerUp(ev: UIEvent) {
    console.debug(`range, ${ev.type}`);

    // prevent default so scrolling does not happen
    ev.preventDefault();
    ev.stopPropagation();

    // update the ratio for the active knob
    this.updateKnob(pointerCoord(ev), this._rect);

    // update the active knob's position
    this._active.position();

    // clear the start coordinates and active knob
    this._start = this._active = null;
    this._pressed = this._knobs.first.pressed = this._knobs.last.pressed = false;
  }

  /**
   * @private
   */
  setActiveKnob(current: PointerCoordinates, rect: ClientRect) {
    // figure out which knob is the closest one to the pointer
    let ratio = (current.x - rect.left) / (rect.width);

    if (this._dual && Math.abs(ratio - this._knobs.first.ratio) > Math.abs(ratio - this._knobs.last.ratio)) {
      this._active = this._knobs.last;

    } else {
      this._active = this._knobs.first;
    }
  }

  /**
   * @private
   */
  updateKnob(current: PointerCoordinates, rect: ClientRect) {
    // figure out where the pointer is currently at
    // update the knob being interacted with
    if (this._active) {
      let oldVal = this._active.value;
      this._active.ratio = (current.x - rect.left) / (rect.width);
      let newVal = this._active.value;

      if (oldVal !== newVal) {
        // value has been updated
        if (this._dual) {
          this.value = {
            lower: Math.min(this._knobs.first.value, this._knobs.last.value),
            upper: Math.max(this._knobs.first.value, this._knobs.last.value),
          };

        } else {
          this.value = newVal;
        }

        this._debouncer.debounce(() => {
          this.onChange(this.value);
          this.ionChange.emit(this);
        });
      }

      this.updateBar();
    }
  }

  /**
   * @private
   */
  updateBar() {
    let firstRatio = this._knobs.first.ratio;

    if (this._dual) {
      let lastRatio = this._knobs.last.ratio;
      this._barL = `${(Math.min(firstRatio, lastRatio) * 100)}%`;
      this._barR = `${100 - (Math.max(firstRatio, lastRatio) * 100)}%`;

    } else {
      this._barL = '';
      this._barR = `${100 - (firstRatio * 100)}%`;
    }

    this.updateTicks();
  }

  /**
   * @private
   */
  createTicks() {
    if (this._snaps) {
      raf(() => {
        // TODO: Fix to not use RAF
        this._ticks = [];
        for (var value = this._min; value <= this._max; value += this._step) {
          var ratio = this.valueToRatio(value);
          this._ticks.push({
            ratio: ratio,
            left: `${ratio * 100}%`,
          });
        }
        this.updateTicks();
      });
    }
  }

  /**
   * @private
   */
  updateTicks() {
    if (this._snaps && this._ticks) {
      let ratio = this.ratio;
      if (this._dual) {
        let upperRatio = this.ratioUpper;

        this._ticks.forEach(t => {
          t.active = (t.ratio >= ratio && t.ratio <= upperRatio);
        });

      } else {
        this._ticks.forEach(t => {
          t.active = (t.ratio <= ratio);
        });
      }
    }
  }

  /**
   * @private
   */
  ratioToValue(ratio: number) {
    ratio = Math.round(((this._max - this._min) * ratio) + this._min);
    return Math.round(ratio / this._step) * this._step;
  }

  /**
   * @private
   */
  valueToRatio(value: number) {
    value = Math.round(clamp(this._min, value, this._max) / this._step) * this._step;
    return (value - this._min) / (this._max - this._min);
  }

  /**
   * @private
   */
  writeValue(val: any) {
    if (isPresent(val)) {
      let knobs = this._knobs;
      this.value = val;

      if (this._knobs) {
        if (this._dual) {
          knobs.first.value = val.lower;
          knobs.last.value = val.upper;
          knobs.last.position();

        } else {
          knobs.first.value = val;
        }
        knobs.first.position();
        this.updateBar();
      }
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
   * Returns the ratio of the knob's is current location, which is a number between `0` and `1`.
   * If two knobs are used, this property represents the lower value.
   */
  get ratio(): number {
    if (this._dual) {
      return Math.min(this._knobs.first.ratio, this._knobs.last.ratio);
    }
    return this._knobs.first.ratio;
  }

  /**
   * Returns the ratio of the upper value's is current location, which is a number between `0` and `1`.
   * If there is only one knob, then this will return `null`.
   */
  get ratioUpper(): number {
    if (this._dual) {
      return Math.max(this._knobs.first.ratio, this._knobs.last.ratio);
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
  onTouched() {}

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
    this._events.unlistenAll();
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
