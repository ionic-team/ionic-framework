import { Component, Element, Event, EventEmitter, Listen, Method, Prop, PropDidChange, State } from '@stencil/core';
import { BaseInputComponent, GestureDetail } from '../../index';
import { clamp } from '../../utils/helpers';

@Component({
  tag: 'ion-range',
  styleUrls: {
    ios: 'range.ios.scss',
    md: 'range.md.scss',
    wp: 'range.wp.scss'
  },
  host: {
    theme: 'range'
  }
})
export class Range implements BaseInputComponent {
  // private rangeId: string;
  // private labelId: string;

  private styleTmr: any;

  activated: boolean = false;
  hasFocus: boolean = false;
  startX: number;

  @Element() rangeEl: HTMLElement;

  @State() _barL: string;
  @State() _barR: string;
  @State() _valA: number = 0;
  @State() _valB: number = 0;
  @State() _ratioA: number = 0;
  @State() _ratioB: number = 0;
  @State() _ticks: any[] = [];
  @State() _activeB: boolean;
  @State() _rect: ClientRect;

  @State() _pressed: boolean;
  @State() _pressedA: boolean;
  @State() _pressedB: boolean;

  @Event() ionChange: EventEmitter;
  @Event() ionStyle: EventEmitter;
  @Event() ionFocus: EventEmitter;
  @Event() ionBlur: EventEmitter;

  @Prop() color: string;
  @Prop() mode: string;

  @Prop({ mutable: true }) value: any;

  @Prop() disabled: boolean = false;
  @Prop() min: number = 0;
  @Prop() max: number = 100;
  @Prop() steps: number = 1;
  @Prop() dualKnobs: boolean = false;
  @Prop() pin: boolean = false;
  @Prop() snaps: boolean = false;
  @Prop() debounce: number = 0;

  fireBlur() {
    if (this.hasFocus) {
      this.hasFocus = false;
      this.ionBlur.emit();
      this.emitStyle();
    }
  }

  @PropDidChange('disabled')
  disabledChanged() {
    this.emitStyle();
  }

  @PropDidChange('value')
  valueChanged(val: boolean) {
    this.ionChange.emit({ value: val });
    this.emitStyle();
  }

  protected ionViewWillLoad() {
    this.inputUpdated();
    this.createTicks();
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
      this._valA = val.lower;
      this._valB = val.upper;
      this._ratioA = this.valueToRatio(val.lower);
      this._ratioB = this.valueToRatio(val.upper);
    } else {
      this._valA = val;
      this._ratioA = this.valueToRatio(val);
    }
    this.updateBar();
  }

  updateBar() {
    const ratioA = this._ratioA;
    const ratioB = this._ratioB;

    if (this.dualKnobs) {
      this._barL = `${Math.min(ratioA, ratioB) * 100}%`;
      this._barR = `${100 - Math.max(ratioA, ratioB) * 100}%`;
    } else {
      this._barL = '';
      this._barR = `${100 - ratioA * 100}%`;
    }

    this.updateTicks();
  }

  createTicks() {
    if (this.snaps) {
      for (let value = this.min; value <= this.max; value += this.steps) {
        let ratio = this.valueToRatio(value);
        this._ticks.push({
          ratio,
          left: `${ratio * 100}%`
        });
      }
      this.updateTicks();
    }
  }

  updateTicks() {
    const ticks = this._ticks;
    const ratio = this.ratio;
    if (this.snaps && ticks) {
      if (this.dualKnobs) {
        let upperRatio = this.ratioUpper();

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
    value = Math.round((value - this.min) / this.steps) * this.steps;
    value = value / (this.max - this.min);
    return clamp(0, value, 1);
  }

  ratioToValue(ratio: number) {
    ratio = Math.round((this.max - this.min) * ratio);
    ratio = Math.round(ratio / this.steps) * this.steps + this.min;
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
    let val = this.ratioToValue(ratio);

    if (this.snaps) {
      // snaps the ratio to the current value
      ratio = this.valueToRatio(val);
    }
    // update which knob is pressed
    this._pressed = isPressed;
    let valChanged = false;
    if (this._activeB) {
      // when the pointer down started it was determined
      // that knob B was the one they were interacting with
      this._pressedB = isPressed;
      this._pressedA = false;
      this._ratioB = ratio;
      valChanged = val === this._valB;
      this._valB = val;
    } else {
      // interacting with knob A
      this._pressedA = isPressed;
      this._pressedB = false;
      this._ratioA = ratio;
      valChanged = val === this._valA;
      this._valA = val;
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
        lower: Math.min(this._valA, this._valB),
        upper: Math.max(this._valA, this._valB)
      };

    } else {
      // single knob only has one value
      value = this._valA;
    }

    // Update input value
    this.value = value;

    return true;
  }

  @Method()
  ratio(): number {
    if (this.dualKnobs) {
      return Math.min(this._ratioA, this._ratioB);
    }
    return this._ratioA;
  }

  @Method()
  ratioUpper() {
    if (this.dualKnobs) {
      return Math.max(this._ratioA, this._ratioB);
    }
    return null;
  }

  @Listen('ionIncrease, ionDecrease')
  keyChng(ev: RangeEvent) {
    const step = this.steps;
    if (ev.detail.knob === 'knobB') {
      if (!!ev.detail.isIncrease) {
        this._valB += step;
      } else {
        this._valB -= step;
      }
      this._valB = clamp(this.min, this._valB, this.max);
      this._ratioB = this.valueToRatio(this._valB);
    } else {
      if (!!ev.detail.isIncrease) {
        this._valA += step;
      } else {
        this._valA -= step;
      }
      this._valA = clamp(this.min, this._valA, this.max);
      this._ratioA = this.valueToRatio(this._valA);
    }
    this.updateBar();
  }

  onDragStart(detail: GestureDetail) {
    if (this.disabled) return false;
    this.fireFocus();

    const current = { x: detail.currentX, y: detail.currentY };
    const el = this.rangeEl.querySelector('.range-slider');
    this._rect = el.getBoundingClientRect();
    const rect = this._rect;

    // figure out which knob they started closer to
    const ratio = clamp(0, (current.x - rect.left) / rect.width, 1);
    this._activeB =
      this.dualKnobs &&
      Math.abs(ratio - this._ratioA) > Math.abs(ratio - this._ratioB);

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
    this.update({ x: detail.currentX, y: detail.currentY }, this._rect, false);
    // trigger ionBlur event
    this.fireBlur();
  }

  onDragMove(detail: GestureDetail) {
    if (this.disabled) {
      return;
    }
    const current = { x: detail.currentX, y: detail.currentY };
    // update the active knob's position
    this.update(current, this._rect, true);
  }


  hostData() {
    return {
      class: {
        'range-disabled': this.disabled,
        'range-pressed': this._pressed,
        'range-has-pin': this.pin
      }
    };
  }

  protected render() {
    return [
      <slot name='range-start' />,

      <ion-gesture
        {...{
          disableScroll: true,
          onStart: this.onDragStart.bind(this),
          onMove: this.onDragMove.bind(this),
          onEnd: this.onDragEnd.bind(this),
          enabled: !this.disabled,
          gestureName: 'range',
          gesturePriority: 30,
          type: 'pan',
          direction: 'x',
          threshold: 0
        }}
      >
        <div class='range-slider'>
          {this._ticks.map(t =>
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
              left: this._barL,
              right: this._barR
            }}
            role='presentation'
          />
          <ion-range-knob
            class='range-knob-handle'
            knob='knobA'
            pressed={this._pressedA}
            ratio={this._ratioA}
            val={this._valA}
            pin={this.pin}
            min={this.min}
            max={this.max}
          />

          {this.dualKnobs
            ? <ion-range-knob
                class='range-knob-handle'
                knob='knobB'
                pressed={this._pressedB}
                ratio={this._ratioB}
                val={this._valB}
                pin={this.pin}
                min={this.min}
                max={this.max}
              />
            : null}
        </div>
      </ion-gesture>,
      <slot name='range-end' />
    ];
  }
}

export interface RangeEvent {
  detail: {
    isIncrease: boolean,
    knob: string
  };
}
