import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { BaseInputComponent, GestureDetail } from '../../index';
import { clamp, debounce } from '../../utils/helpers';

@Component({
  tag: 'ion-range',
  styleUrls: {
    ios: 'range.ios.scss',
    md: 'range.md.scss'
  },
  host: {
    theme: 'range'
  }
})
export class Range implements BaseInputComponent {

  private styleTmr: any;

  activated = false;
  hasFocus = false;
  startX: number;

  @Element() private el: HTMLElement;

  @State() barL: string;
  @State() barR: string;
  @State() valA = 0;
  @State() valB = 0;
  @State() ratioA = 0;
  @State() ratioB = 0;
  @State() ticks: any[] = [];
  @State() activeB: boolean;
  @State() rect: ClientRect;

  @State() pressed: boolean;
  @State() pressedA: boolean;
  @State() pressedB: boolean;

  /**
   * Emitted when the value property has changed.
   */
  @Event() ionChange: EventEmitter;

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter;

  /**
   * Emitted when the range has focus.
   */
  @Event() ionFocus: EventEmitter;

  /**
   * Emitted when the range loses focus.
   */
  @Event() ionBlur: EventEmitter;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * How long, in milliseconds, to wait to trigger the
   * `ionChange` event after each change in the range value. Default `0`.
   */
  @Prop() debounce = 0;

  @Watch('debounce')
  private debounceChange() {
    this.ionChange.emit = debounce(
      this.ionChange.emit.bind(this.ionChange),
      this.debounce
    );
  }

  /*
   * If true, the user cannot interact with the range. Default false.
   */
  @Prop() disabled = false;

  /**
   * Show two knobs. Defaults to `false`.
   */
  @Prop() dualKnobs = false;

  /**
   * Maximum integer value of the range. Defaults to `100`.
   */
  @Prop() max = 100;

  /**
   * Minimum integer value of the range. Defaults to `0`.
   */
  @Prop() min = 0;

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

  /**
   * the value of the range.
   */
  @Prop({ mutable: true }) value: any;


  @Watch('disabled')
  protected disabledChanged() {
    this.emitStyle();
  }

  @Watch('value')
  protected valueChanged(val: boolean) {
    this.ionChange.emit({value: val});
    this.inputUpdated();
    this.emitStyle();
  }

  componentWillLoad() {
    this.inputUpdated();
    this.createTicks();
    this.debounceChange();
    this.emitStyle();
  }

  private emitStyle() {
    clearTimeout(this.styleTmr);

    this.styleTmr = setTimeout(() => {
      this.ionStyle.emit({
        'range-disabled': this.disabled
      });
    });
  }

  fireBlur() {
    if (this.hasFocus) {
      this.hasFocus = false;
      this.ionBlur.emit();
      this.emitStyle();
    }
  }

  fireFocus() {
    if (!this.hasFocus) {
      this.hasFocus = true;
      this.ionFocus.emit();
      this.emitStyle();
    }
  }

  inputUpdated() {
    const val = this.value;
    if (this.dualKnobs) {
      this.valA = val.lower;
      this.valB = val.upper;
      this.ratioA = this.valueToRatio(val.lower);
      this.ratioB = this.valueToRatio(val.upper);
    } else {
      this.valA = val;
      this.ratioA = this.valueToRatio(val);
    }
    this.updateBar();
  }

  updateBar() {
    const ratioA = this.ratioA;
    const ratioB = this.ratioB;

    if (this.dualKnobs) {
      this.barL = `${Math.min(ratioA, ratioB) * 100}%`;
      this.barR = `${100 - Math.max(ratioA, ratioB) * 100}%`;
    } else {
      this.barL = '';
      this.barR = `${100 - ratioA * 100}%`;
    }

    this.updateTicks();
  }

  createTicks() {
    if (this.snaps) {
      for (let value = this.min; value <= this.max; value += this.step) {
        const ratio = this.valueToRatio(value);
        this.ticks.push({
          ratio,
          left: `${ratio * 100}%`
        });
      }
      this.updateTicks();
    }
  }

  updateTicks() {
    const ticks = this.ticks;
    const ratio = this.ratio;
    if (this.snaps && ticks) {
      if (this.dualKnobs) {
        const upperRatio = this.ratioUpper();

        ticks.forEach(t => {
          t.active = t.ratio >= ratio && t.ratio <= upperRatio;
        });
      } else {
        ticks.forEach(t => {
          t.active = t.ratio <= ratio;
        });
      }
    }
  }

  valueToRatio(value: number) {
    value = Math.round((value - this.min) / this.step) * this.step;
    value = value / (this.max - this.min);
    return clamp(0, value, 1);
  }

  ratioToValue(ratio: number) {
    ratio = Math.round((this.max - this.min) * ratio);
    ratio = Math.round(ratio / this.step) * this.step + this.min;
    return clamp(this.min, ratio, this.max);
  }

  inputNormalize(val: any): any {
    if (this.dualKnobs) {
      return val;
    } else {
      val = parseFloat(val);
      return isNaN(val) ? undefined : val;
    }
  }

  update(current: { x?: number; y?: number }, rect: ClientRect, isPressed: boolean) {
    // figure out where the pointer is currently at
    // update the knob being interacted with
    let ratio = clamp(0, (current.x - rect.left) / rect.width, 1);
    const val = this.ratioToValue(ratio);

    if (this.snaps) {
      // snaps the ratio to the current value
      ratio = this.valueToRatio(val);
    }
    // update which knob is pressed
    this.pressed = isPressed;
    let valChanged = false;
    if (this.activeB) {
      // when the pointer down started it was determined
      // that knob B was the one they were interacting with
      this.pressedB = isPressed;
      this.pressedA = false;
      this.ratioB = ratio;
      valChanged = val === this.valB;
      this.valB = val;
    } else {
      // interacting with knob A
      this.pressedA = isPressed;
      this.pressedB = false;
      this.ratioA = ratio;
      valChanged = val === this.valA;
      this.valA = val;
    }

    this.updateBar();
    if (valChanged) {
      return false;
    }

    // value has been updated
    let value;
    if (this.dualKnobs) {
      // dual knobs have an lower and upper value
      value = {
        lower: Math.min(this.valA, this.valB),
        upper: Math.max(this.valA, this.valB)
      };

    } else {
      // single knob only has one value
      value = this.valA;
    }

    // Update input value
    this.value = value;

    return true;
  }

  /**
   * Returns the ratio of the knob's is current location, which is a number
   * between `0` and `1`. If two knobs are used, this property represents
   * the lower value.
   */
  @Method()
  ratio(): number {
    if (this.dualKnobs) {
      return Math.min(this.ratioA, this.ratioB);
    }
    return this.ratioA;
  }

  /**
   * Returns the ratio of the upper value's is current location, which is
   * a number between `0` and `1`. If there is only one knob, then this
   * will return `null`.
   */
  @Method()
  ratioUpper() {
    if (this.dualKnobs) {
      return Math.max(this.ratioA, this.ratioB);
    }
    return null;
  }

  @Listen('ionIncrease, ionDecrease')
  keyChng(ev: RangeEvent) {
    const step = this.step;
    if (ev.detail.knob === 'knobB') {
      if (ev.detail.isIncrease) {
        this.valB += step;
      } else {
        this.valB -= step;
      }
      this.valB = clamp(this.min, this.valB, this.max);
      this.ratioB = this.valueToRatio(this.valB);
    } else {
      if (ev.detail.isIncrease) {
        this.valA += step;
      } else {
        this.valA -= step;
      }
      this.valA = clamp(this.min, this.valA, this.max);
      this.ratioA = this.valueToRatio(this.valA);
    }
    this.updateBar();
  }

  onDragStart(detail: GestureDetail) {
    if (this.disabled) return false;
    this.fireFocus();

    const current = { x: detail.currentX, y: detail.currentY };
    const el = this.el.querySelector('.range-slider');
    this.rect = el.getBoundingClientRect();
    const rect = this.rect;

    // figure out which knob they started closer to
    const ratio = clamp(0, (current.x - rect.left) / rect.width, 1);
    this.activeB =
      this.dualKnobs &&
      Math.abs(ratio - this.ratioA) > Math.abs(ratio - this.ratioB);

    // update the active knob's position
    this.update(current, rect, true);

    // return true so the pointer events
    // know everything's still valid
    return true;
  }

  onDragEnd(detail: GestureDetail) {
    if (this.disabled) {
      return;
    }
    // update the active knob's position
    this.update({ x: detail.currentX, y: detail.currentY }, this.rect, false);
    // trigger ionBlur event
    this.fireBlur();
  }

  onDragMove(detail: GestureDetail) {
    if (this.disabled) {
      return;
    }
    const current = { x: detail.currentX, y: detail.currentY };
    // update the active knob's position
    this.update(current, this.rect, true);
  }

  hostData() {
    return {
      class: {
        'range-disabled': this.disabled,
        'range-pressed': this.pressed,
        'range-has-pin': this.pin
      }
    };
  }

  render() {
    return [
      <slot name='start'></slot>,
      <ion-gesture
        {...{
          disableScroll: true,
          onStart: this.onDragStart.bind(this),
          onMove: this.onDragMove.bind(this),
          onEnd: this.onDragEnd.bind(this),
          disabled: this.disabled,
          gestureName: 'range',
          gesturePriority: 30,
          type: 'pan',
          direction: 'x',
          threshold: 0
        }}
      >
        <div class='range-slider'>
          {this.ticks.map(t =>
            <div
              style={{ left: t.left }}
              role='presentation'
              class={{ 'range-tick': true, 'range-tick-active': t.active }}
            />
          )}

          <div class='range-bar' role='presentation' />
          <div
            class='range-bar range-bar-active'
            style={{
              left: this.barL,
              right: this.barR
            }}
            role='presentation'
          />
          <ion-range-knob
            class='range-knob-handle'
            knob='knobA'
            pressed={this.pressedA}
            ratio={this.ratioA}
            val={this.valA}
            pin={this.pin}
            min={this.min}
            max={this.max}
          />

          {this.dualKnobs
            ? <ion-range-knob
                class='range-knob-handle'
                knob='knobB'
                pressed={this.pressedB}
                ratio={this.ratioB}
                val={this.valB}
                pin={this.pin}
                min={this.min}
                max={this.max}
              />
            : null}
        </div>
      </ion-gesture>,
      <slot name='end'></slot>
    ];
  }
}

export interface RangeEvent extends Event {
  detail: {
    isIncrease: boolean,
    knob: string
  };
}
