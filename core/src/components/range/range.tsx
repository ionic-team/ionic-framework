import { Component, Element, Event, EventEmitter, Listen, Prop, QueueApi, State, Watch } from '@stencil/core';

import { BaseInput, Color, Gesture, GestureDetail, Mode, RangeInputChangeEvent, StyleEvent } from '../../interface';
import { clamp, debounceEvent, deferEvent } from '../../utils/helpers';
import { createColorClasses, hostContext } from '../../utils/theme';

import { Knob, RangeEventDetail, RangeValue } from './range-interface';

@Component({
  tag: 'ion-range',
  styleUrls: {
    ios: 'range.ios.scss',
    md: 'range.md.scss'
  },
  shadow: true
})
export class Range implements BaseInput {

  private noUpdate = false;
  private rect!: ClientRect;
  private hasFocus = false;
  private rangeSlider?: HTMLElement;
  private gesture?: Gesture;

  @Element() el!: HTMLStencilElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  @State() private ratioA = 0;
  @State() private ratioB = 0;
  @State() private pressedKnob: Knob;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * How long, in milliseconds, to wait to trigger the
   * `ionChange` event after each change in the range value. Default `0`.
   */
  @Prop() debounce = 0;

  @Watch('debounce')
  protected debounceChanged() {
    this.ionChange = debounceEvent(this.ionChange, this.debounce);
  }

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name = '';

  /**
   * Show two knobs. Defaults to `false`.
   */
  @Prop() dualKnobs = false;

  /**
   * Minimum integer value of the range. Defaults to `0`.
   */
  @Prop() min = 0;

  /**
   * Maximum integer value of the range. Defaults to `100`.
   */
  @Prop() max = 100;

  /**
   * If true, a pin with integer value is shown when the knob
   * is pressed. Defaults to `false`.
   */
  @Prop() pin = false;

  /**
   * If true, the knob snaps to tick marks evenly spaced based
   * on the step property value. Defaults to `false`.
   */
  @Prop() snaps = false;

  /**
   * Specifies the value granularity. Defaults to `1`.
   */
  @Prop() step = 1;

  /*
   * If true, the user cannot interact with the range. Defaults to `false`.
   */
  @Prop() disabled = false;
  @Watch('disabled')
  protected disabledChanged() {
    if (this.gesture) {
      this.gesture.setDisabled(this.disabled);
    }
    this.emitStyle();
  }

  /**
   * the value of the range.
   */
  @Prop({ mutable: true })
  value: any = 0;
  @Watch('value')
  protected valueChanged(value: RangeValue) {
    if (!this.noUpdate) {
      this.updateRatio();
    }
    this.ionChange.emit({ value });
  }

  /**
   * Emitted when the value property has changed.
   */
  @Event() ionChange!: EventEmitter<RangeInputChangeEvent>;

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle!: EventEmitter<StyleEvent>;

  /**
   * Emitted when the range has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the range loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  componentWillLoad() {
    this.ionStyle = deferEvent(this.ionStyle);

    this.updateRatio();
    this.debounceChanged();
    this.emitStyle();
  }

  async componentDidLoad() {
    this.gesture = (await import('../../utils/gesture/gesture')).createGesture({
      el: this.rangeSlider!,
      queue: this.queue,
      gestureName: 'range',
      gesturePriority: 30,
      threshold: 0,
      onStart: this.onDragStart.bind(this),
      onMove: this.onDragMove.bind(this),
      onEnd: this.onDragEnd.bind(this),
    });
    this.gesture.setDisabled(this.disabled);
  }

  @Listen('ionIncrease')
  @Listen('ionDecrease')
  keyChng(ev: CustomEvent<RangeEventDetail>) {
    let step = this.step;
    step = step > 0 ? step : 1;
    step = step / (this.max - this.min);
    if (!ev.detail.isIncrease) {
      step *= -1;
    }
    if (ev.detail.knob === 'A') {
      this.ratioA += step;
    } else {
      this.ratioB += step;
    }
  }

  private getValue(): RangeValue {
    const value = this.value || 0;
    if (this.dualKnobs) {
      if (typeof value === 'object') {
        return value;
      }
      return {
        lower: 0,
        upper: value
      };
    } else {
      if (typeof value === 'object') {
        return value.upper;
      }
      return value;
    }
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive-disabled': this.disabled
    });
  }

  private fireBlur() {
    if (this.hasFocus) {
      this.hasFocus = false;
      this.ionBlur.emit();
      this.emitStyle();
    }
  }

  private fireFocus() {
    if (!this.hasFocus) {
      this.hasFocus = true;
      this.ionFocus.emit();
      this.emitStyle();
    }
  }

  private onDragStart(detail: GestureDetail) {
    this.fireFocus();

    const rect = this.rect = this.rangeSlider!.getBoundingClientRect() as any;
    const currentX = detail.currentX;

    // figure out which knob they started closer to
    const ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
    this.pressedKnob =
      !this.dualKnobs ||
      Math.abs(this.ratioA - ratio) < Math.abs(this.ratioB - ratio)
        ? 'A'
        : 'B';

    // update the active knob's position
    this.update(currentX);
  }

  private onDragMove(detail: GestureDetail) {
    this.update(detail.currentX);
  }

  private onDragEnd(detail: GestureDetail) {
    this.update(detail.currentX);
    this.pressedKnob = undefined;
    this.fireBlur();
  }

  private update(currentX: number) {
    // figure out where the pointer is currently at
    // update the knob being interacted with
    const rect = this.rect;
    let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
    if (this.snaps) {
      // snaps the ratio to the current value
      const value = ratioToValue(ratio, this.min, this.max, this.step);
      ratio = valueToRatio(value, this.min, this.max);
    }

    // update which knob is pressed
    if (this.pressedKnob === 'A') {
      this.ratioA = ratio;
    } else {
      this.ratioB = ratio;
    }

    // Update input value
    this.updateValue();
  }

  private get valA() {
    return ratioToValue(this.ratioA, this.min, this.max, this.step);
  }

  private get valB() {
    return ratioToValue(this.ratioB, this.min, this.max, this.step);
  }

  private get ratioLower() {
    if (this.dualKnobs) {
      return Math.min(this.ratioA, this.ratioB);
    }
    return 0;
  }

  private get ratioUpper() {
    if (this.dualKnobs) {
      return Math.max(this.ratioA, this.ratioB);
    }
    return this.ratioA;
  }

  private updateRatio() {
    const value = this.getValue() as any;
    const { min, max } = this;
    if (this.dualKnobs) {
      this.ratioA = valueToRatio(value.lower, min, max);
      this.ratioB = valueToRatio(value.upper, min, max);
    } else {
      this.ratioA = valueToRatio(value, min, max);
    }
  }

  private updateValue() {
    this.noUpdate = true;

    const { valA, valB } = this;
    this.value = !this.dualKnobs
      ? valA
      : {
          lower: Math.min(valA, valB),
          upper: Math.max(valA, valB)
        };

    this.noUpdate = false;
  }

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        'in-item': hostContext('.item', this.el),
        'range-disabled': this.disabled,
        'range-pressed': this.pressedKnob !== undefined,
        'range-has-pin': this.pin
      }
    };
  }

  render() {
    const { min, max, step, ratioLower, ratioUpper } = this;

    const barL = `${ratioLower * 100}%`;
    const barR = `${100 - ratioUpper * 100}%`;

    const ticks = [];
    if (this.snaps) {
      for (let value = min; value <= max; value += step) {
        const ratio = valueToRatio(value, min, max);
        ticks.push({
          ratio,
          active: ratio >= ratioLower && ratio <= ratioUpper,
          left: `${ratio * 100}%`
        });
      }
    }

    return [
      <slot name="start"></slot>,
      <div class="range-slider" ref={el => this.rangeSlider = el}>
        {ticks.map(t => (
          <div
            style={{ left: t.left }}
            role="presentation"
            class={{
              'range-tick': true,
              'range-tick-active': t.active
            }}
          />
        ))}

        <div class="range-bar" role="presentation" />
        <div
          class="range-bar range-bar-active"
          role="presentation"
          style={{
            left: barL,
            right: barR
          }}
        />
        <ion-range-knob
          knob="A"
          pressed={this.pressedKnob === 'A'}
          value={this.valA}
          ratio={this.ratioA}
          pin={this.pin}
          min={min}
          max={max}
        />

        {this.dualKnobs && (
          <ion-range-knob
            knob="B"
            pressed={this.pressedKnob === 'B'}
            value={this.valB}
            ratio={this.ratioB}
            pin={this.pin}
            min={min}
            max={max}
          />
        )}
      </div>,
      <slot name="end"></slot>
    ];
  }
}

export function ratioToValue(
  ratio: number,
  min: number,
  max: number,
  step: number
): number {
  let value = (max - min) * ratio;
  if (step > 0) {
    value = Math.round(value / step) * step + min;
  }
  return clamp(min, value, max);
}

export function valueToRatio(value: number, min: number, max: number): number {
  return clamp(0, (value - min) / (max - min), 1);
}
