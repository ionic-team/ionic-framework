import { Component, Input, OnInit } from '@angular/core';

import { clamp, isNumber, isPresent, isString, isTrueProperty } from '../../util/util';

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
  _upper: boolean = false;
  pressed: boolean;

  @Input()
  get upper(): boolean {
    return this._upper;
  }
  set upper(val: boolean) {
    this._upper = isTrueProperty(val);
  }

  constructor(public range: RangeKnobDelegate) { }

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
        if (this._upper) {
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

export class RangeKnobDelegate {
  dualKnobs: boolean;
  ratioToValue: (ratio: number) => number;
  valueToRatio: (value: number) => number;
  value: any;
  snaps: boolean;
}
