import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, QueueApi, State, Watch } from '@stencil/core';

import { Color, Gesture, GestureDetail, KnobName, Mode, RangeChangeEventDetail, RangeValue, StyleEventDetail } from '../../interface';
import { clamp, debounceEvent } from '../../utils/helpers';
import { createColorClasses, hostContext } from '../../utils/theme';

/**
 * @slot start - Content is placed to the left of the range slider in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the range slider in LTR, and to the left in RTL.
 */
@Component({
  tag: 'ion-range',
  styleUrls: {
    ios: 'range.ios.scss',
    md: 'range.md.scss'
  },
  shadow: true
})
export class Range implements ComponentInterface {

  private noUpdate = false;
  private rect!: ClientRect;
  private hasFocus = false;
  private rangeSlider?: HTMLElement;
  private gesture?: Gesture;

  @Element() el!: HTMLStencilElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  @State() private ratioA = 0;
  @State() private ratioB = 0;
  @State() private pressedKnob: KnobName;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * The neutral point of the range slider.
   * Default: value is `0` or the `min` when `neutralPoint < min` or `max` when `max < neutralPoint`.
   */
  @Prop() neutralPoint = 0;
  protected neutralPointChanged() {
    if (this.noUpdate) {
      return;
    }
    const { min, max, neutralPoint } = this;

    if (max < neutralPoint) {
      this.neutralPoint = max;
    }
    if (neutralPoint < min) {
      this.neutralPoint = min;
    }
  }

  /**
   * How long, in milliseconds, to wait to trigger the
   * `ionChange` event after each change in the range value.
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
   * Show two knobs.
   */
  @Prop() dualKnobs = false;

  /**
   * Minimum integer value of the range.
   */
  @Prop() min = 0;
  @Watch('min')
  protected minChanged() {
    if (!this.noUpdate) {
      this.updateRatio();
    }
  }

  /**
   * Maximum integer value of the range.
   */
  @Prop() max = 100;
  @Watch('max')
  protected maxChanged() {
    if (!this.noUpdate) {
      this.updateRatio();
    }
  }

  /**
   * If `true`, a pin with integer value is shown when the knob
   * is pressed.
   */
  @Prop() pin = false;

  /**
   * If `true`, the knob snaps to tick marks evenly spaced based
   * on the step property value.
   */
  @Prop() snaps = false;

  /**
   * Specifies the value granularity.
   */
  @Prop() step = 1;

  /**
   * If `true`, the user cannot interact with the range.
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
  @Prop({ mutable: true }) value: RangeValue | null = null;
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
  @Event() ionChange!: EventEmitter<RangeChangeEventDetail>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  /**
   * Emitted when the range has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the range loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  @Listen('focusout')
  onBlur() {
    if (this.hasFocus) {
      this.hasFocus = false;
      this.ionBlur.emit();
      this.emitStyle();
    }
  }

  @Listen('focusin')
  onFocus() {
    if (!this.hasFocus) {
      this.hasFocus = true;
      this.ionFocus.emit();
      this.emitStyle();
    }
  }

  componentWillLoad() {
    this.updateRatio();
    this.debounceChanged();
    this.emitStyle();
  }

  async componentDidLoad() {
    this.gesture = (await import('../../utils/gesture')).createGesture({
      el: this.rangeSlider!,
      queue: this.queue,
      gestureName: 'range',
      gesturePriority: 100,
      threshold: 0,
      onStart: ev => this.onStart(ev),
      onMove: ev => this.onMove(ev),
      onEnd: ev => this.onEnd(ev),
    });
    this.gesture.setDisabled(this.disabled);
  }

  componentDidUnload() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }

  private handleKeyboard = (knob: KnobName, isIncrease: boolean) => {
    let step = this.step;
    step = step > 0 ? step : 1;
    step = step / (this.max - this.min);
    if (!isIncrease) {
      step *= -1;
    }
    if (knob === 'A') {
      this.ratioA = clamp(0, this.ratioA + step, 1);
    } else {
      this.ratioB = clamp(0, this.ratioB + step, 1);
    }
    this.updateValue();
  }

  private getValue(): RangeValue {
    const value = this.value || this.neutralPoint || 0;
    if (this.dualKnobs) {
      if (typeof value === 'object') {
        return value;
      }
      return {
        lower: this.value === null ? this.neutralPoint : 0,
        upper: this.value === null ? this.neutralPoint : value
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
      'interactive': true,
      'interactive-disabled': this.disabled
    });
  }

  private onStart(detail: GestureDetail) {
    const rect = this.rect = this.rangeSlider!.getBoundingClientRect() as any;
    const currentX = detail.currentX;

    // figure out which knob they started closer to
    let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
    if (document.dir === 'rtl') {
      ratio = 1 - ratio;
    }

    this.pressedKnob =
      !this.dualKnobs ||
      Math.abs(this.ratioA - ratio) < Math.abs(this.ratioB - ratio)
        ? 'A'
        : 'B';

    this.setFocus(this.pressedKnob);

    // update the active knob's position
    this.update(currentX);
  }

  private onMove(detail: GestureDetail) {
    this.update(detail.currentX);
  }

  private onEnd(detail: GestureDetail) {
    this.update(detail.currentX);
    this.pressedKnob = undefined;
  }

  private update(currentX: number) {
    // figure out where the pointer is currently at
    // update the knob being interacted with
    const rect = this.rect;
    let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
    if (document.dir === 'rtl') {
      ratio = 1 - ratio;
    }

    if (this.snaps) {
      // snaps the ratio to the current value
      ratio = valueToRatio(
        ratioToValue(ratio, this.min, this.max, this.step),
        this.min,
        this.max
      );
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

  private setFocus(knob: KnobName) {
    if (this.el.shadowRoot) {
      const knobEl = this.el.shadowRoot.querySelector(knob === 'A' ? '.range-knob-a' : '.range-knob-b') as HTMLElement | undefined;
      if (knobEl) {
        knobEl.focus();
      }
    }
  }

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        'in-item': hostContext('ion-item', this.el),
        'range-disabled': this.disabled,
        'range-pressed': this.pressedKnob !== undefined,
        'range-has-pin': this.pin
      }
    };
  }
  protected getActiveBarPosition() {
    const { min, max, neutralPoint, ratioLower, ratioUpper } = this;
    const neutralPointRatio = valueToRatio(neutralPoint, min, max);

    const isRTL = document.dir === 'rtl';
    const start = isRTL ? 'right' : 'left';
    const end = isRTL ? 'left' : 'right';
    const style: any = {};

    // dual knob handling
    style[start] = `${ratioLower * 100}%`;
    style[end] = `${100 - ratioUpper * 100}%`;

    // single knob handling
    if (!this.dualKnobs) {
      if (this.ratioA < neutralPointRatio) {
        style[end] = `${neutralPointRatio * 100}%`;
        style[start] = `${this.ratioA * 100}%`;
      } else {
        style[end] = `${100 - this.ratioA * 100}%`;
        style[start] = `${neutralPointRatio * 100}%`;
      }
    }

    return style;
  }

  protected isTickActive(stepRatio: number) {
    const { min, max, neutralPoint, ratioLower, ratioUpper } = this;
    const neutralPointRatio = valueToRatio(neutralPoint, min, max);

    if (this.dualKnobs) {
      return (stepRatio >= ratioLower && stepRatio <= ratioUpper);
    }

    if (this.ratioA <= neutralPointRatio && stepRatio >= this.ratioA && stepRatio <= neutralPointRatio) {
      return true;
    }

    if (this.ratioA >= neutralPointRatio && stepRatio <= this.ratioA && stepRatio >= neutralPointRatio) {
      return true;
    }

    return false;
  }

  render() {
    const { min, max, neutralPoint, step } = this;
    const barPosition = this.getActiveBarPosition();

    const isRTL = document.dir === 'rtl';
    const start = isRTL ? 'right' : 'left';
    const end = isRTL ? 'left' : 'right';

    const ticks: any[] = [];

    if (this.snaps) {
      for (let value = min; value <= max; value += step) {
        const ratio = valueToRatio(value, min, max);

        const tick: any = {
          ratio,
          active: this.isTickActive(ratio),
        };

        tick[start] = `${ratio * 100}%`;

        ticks.push(tick);
      }
    }

    const tickStyle = (tick: any) => {
      const style: any = {};
      style[start] = tick[start];

      return style;
    };

    const barStyle = () => {
      const style: any = {};

      style[start] = barPosition[start];
      style[end] = barPosition[end];

      return style;
    };

    return [
      <slot name="start"></slot>,
      <div class="range-slider" ref={el => this.rangeSlider = el}>
        {ticks.map(tick => (
          <div
            style={tickStyle(tick)}
            role="presentation"
            class={{
              'range-tick': true,
              'range-tick-active': tick.active
            }}
          />
        ))}

        <div class="range-bar" role="presentation" />
        <div
          class="range-bar range-bar-active"
          role="presentation"
          style={barStyle()}
        />

        { renderKnob({
          knob: 'A',
          pressed: this.pressedKnob === 'A',
          value: this.valA,
          ratio: this.ratioA,
          pin: this.pin,
          disabled: this.disabled,
          handleKeyboard: this.handleKeyboard,
          min,
          max,
          neutralPoint
        })}

        { this.dualKnobs && renderKnob({
          knob: 'B',
          pressed: this.pressedKnob === 'B',
          value: this.valB,
          ratio: this.ratioB,
          pin: this.pin,
          disabled: this.disabled,
          handleKeyboard: this.handleKeyboard,
          min,
          max,
          neutralPoint
        })}
      </div>,
      <slot name="end"></slot>
    ];
  }
}

interface RangeKnob {
  knob: KnobName;
  value: number;
  ratio: number;
  min: number;
  max: number;
  neutralPoint: number;
  disabled: boolean;
  pressed: boolean;
  pin: boolean;

  handleKeyboard: (name: KnobName, isIncrease: boolean) => void;
}

function renderKnob({ knob, value, ratio, min, max, neutralPoint, disabled, pressed, pin, handleKeyboard }: RangeKnob) {
  const isRTL = document.dir === 'rtl';
  const start = isRTL ? 'right' : 'left';

  const knobStyle = () => {
    const style: any = {};
    style[start] = `${ratio * 100}%`;

    return style;
  };

  return (
    <div
      onKeyDown={(ev: KeyboardEvent) => {
        const key = ev.key;
        if (key === 'ArrowLeft' || key === 'ArrowDown') {
          handleKeyboard(knob, false);
          ev.preventDefault();
          ev.stopPropagation();

        } else if (key === 'ArrowRight' || key === 'ArrowUp') {
          handleKeyboard(knob, true);
          ev.preventDefault();
          ev.stopPropagation();
        }
      }}
      class={{
        'range-knob-handle': true,
        'range-knob-a': knob === 'A',
        'range-knob-b': knob === 'B',
        'range-knob-pressed': pressed,
        'range-knob-min': value === min,
        'range-knob-max': value === max,
        'range-knob-neutral': value === neutralPoint
      }}
      style={knobStyle()}
      role="slider"
      tabindex={disabled ? -1 : 0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-disabled={disabled ? 'true' : null}
      aria-valuenow={value}
      aria-valueneutral={neutralPoint}
    >
      {pin && <div class="range-pin" role="presentation">{Math.round(value)}</div>}
      <div class="range-knob" role="presentation" />
    </div>
  );
}

function ratioToValue(
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

function valueToRatio(value: number, min: number, max: number): number {
  return clamp(0, (value - min) / (max - min), 1);
}
