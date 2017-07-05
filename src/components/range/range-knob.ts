import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_UP } from '../../platform/key';

/**
 * @hidden
 */
@Component({
  selector: '.range-knob-handle',
  template:
    '<div class="range-pin" *ngIf="pin" role="presentation">{{val}}</div>' +
    '<div class="range-knob" role="presentation"></div>',
  host: {
    '[class.range-knob-pressed]': 'pressed',
    '[class.range-knob-min]': 'val===min||val===undefined',
    '[class.range-knob-max]': 'val===max',
    '[style.left]': '_x',
    '[attr.aria-valuenow]': 'val',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-labelledby]': 'labelId',
    '[tabindex]': 'disabled?-1:0',
    'role': 'slider'
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
  @Input() disabled: boolean;
  @Input() labelId: string;

  @Output() ionIncrease = new EventEmitter();
  @Output() ionDecrease = new EventEmitter();

  @HostListener('keydown', ['$event']) _keyup(ev: KeyboardEvent) {
    const keyCode = ev.keyCode;
    if (keyCode === KEY_LEFT || keyCode === KEY_DOWN) {
      console.debug(`range-knob, decrease, keyCode: ${keyCode}`);
      this.ionDecrease.emit();
      ev.preventDefault();
      ev.stopPropagation();

    } else if (keyCode === KEY_RIGHT || keyCode === KEY_UP) {
      console.debug(`range-knob, increase, keyCode: ${keyCode}`);
      this.ionIncrease.emit();
      ev.preventDefault();
      ev.stopPropagation();
    }
  }
}
