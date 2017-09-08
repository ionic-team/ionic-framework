import { Component, Event, EventEmitter, Listen, Prop } from '@stencil/core';

@Component({
  tag: `ion-range-knob`
})
export class RangeKnob {
  @Prop() pressed: boolean;
  @Prop() pin: boolean;
  @Prop() min: number;
  @Prop() max: number;
  @Prop() val: number;
  @Prop() disabled: boolean;
  @Prop() labelId: string;
  @Prop() knob: string;
  @Prop() ratio: number;

  @Event() ionIncrease: EventEmitter;
  @Event() ionDecrease: EventEmitter;

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

  leftPos(val: number) {
    return `${val * 100}%`;
  }

  hostData() {
    return {
      class: {
        'range-knob-pressed': this.pressed,
        'range-knob-min': this.val === this.min || this.val === undefined,
        'range-knob-max': this.val === this.max
      },
      style: {
        'left': this.leftPos(this.ratio)
      },
      attrs: {
        'role': 'slider',
        'tabindex': this.disabled ? -1 : 0,
        'aria-valuemin': this.min,
        'aria-valuemax': this.max,
        'aria-disabled': this.disabled,
        'aria-labelledby': this.labelId,
        'aria-valuenow': this.val
      }
    };
  }

  render() {
    if (this.pin) {
      return [
        <div class="range-pin" role="presentation">{this.val}</div>,
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
