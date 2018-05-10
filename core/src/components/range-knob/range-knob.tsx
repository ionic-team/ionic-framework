import { Component, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { Knob } from '../../interface';

@Component({
  tag: `ion-range-knob`
})
export class RangeKnob {

  @Prop() pressed!: boolean;
  @Prop() pin!: boolean;
  @Prop() min!: number;
  @Prop() max!: number;
  @Prop() value!: number;
  @Prop() ratio!: number;
  @Prop() disabled!: boolean;
  @Prop() labelId!: string;
  @Prop() knob!: Knob;

  @Event() ionIncrease!: EventEmitter;
  @Event() ionDecrease!: EventEmitter;

  @Listen('keydown')
  handleKeyBoard(ev: KeyboardEvent) {
    const keyCode = ev.keyCode;
    if (keyCode === KEY_LEFT || keyCode === KEY_DOWN) {
      this.ionDecrease.emit({isIncrease: false, knob: this.knob});
      ev.preventDefault();
      ev.stopPropagation();

    } else if (keyCode === KEY_RIGHT || keyCode === KEY_UP) {
      this.ionIncrease.emit({isIncrease: true, knob: this.knob});
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  hostData() {
    const {value, min, max} = this;
    const pos = this.ratio * 100;
    return {
      class: {
        'range-knob-handle': true,
        'range-knob-pressed': this.pressed,
        'range-knob-min': value === min,
        'range-knob-max': value === max
      },
      style: {
        'left': `${pos}%`
      },
      'role': 'slider',
      'tabindex': this.disabled ? -1 : 0,
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-disabled': this.disabled,
      'aria-labelledby': this.labelId,
      'aria-valuenow': value
    };
  }

  render() {
    if (this.pin) {
      return [
        <div class="range-pin" role="presentation">{Math.round(this.value)}</div>,
        <div class="range-knob" role="presentation" />
      ];
    }
    return <div class="range-knob" role="presentation" />;
  }
}

export const KEY_LEFT = 37;
export const KEY_UP = 38;
export const KEY_RIGHT = 39;
export const KEY_DOWN = 40;
