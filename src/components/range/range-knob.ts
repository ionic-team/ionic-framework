import { Component, Input } from '@angular/core';


/**
 * @private
 */
@Component({
  selector: '.range-knob-handle',
  template:
    '<div class="range-pin" *ngIf="pin">{{val}}</div>' +
    '<div class="range-knob"></div>',
  host: {
    '[class.range-knob-pressed]': 'pressed',
    '[class.range-knob-min]': 'val===min||val===undefined',
    '[class.range-knob-max]': 'val===max',
    '[style.left]': '_x',
    '[attr.aria-valuenow]': 'val',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuemax]': 'max',
    'role': 'slider',
    'tabindex': '0'
  }
})
export class RangeKnob {
  _x: string;

  @Input() set ratio(r: number) {
    this._x = `${r * 100}%`;
  }
  @Input() pressed: boolean;
  @Input() pin: boolean;
  @Input() min: number;
  @Input() max: number;
  @Input() val: number;
}
