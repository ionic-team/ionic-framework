import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, Watch, h } from '@stencil/core';
import { findClosestIonContent, disableContentScrollY, resetContentScrollY } from '@utils/content';
import type { LegacyFormController } from '@utils/forms';
import { createLegacyFormController } from '@utils/forms';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes, clamp, debounceEvent, getAriaLabel, renderHiddenInput } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';
import { isRTL } from '@utils/rtl';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color, Gesture, GestureDetail, StyleEventDetail } from '../../interface';
import { roundToMaxDecimalPlaces } from '../../utils/floating-point';

import type {
  KnobName,
  RangeChangeEventDetail,
  RangeKnobMoveEndEventDetail,
  RangeKnobMoveStartEventDetail,
  RangeValue,
  PinFormatter,
} from './range-interface';

// TODO(FW-2832): types

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of components.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the appearance of components.
 *
 * @slot label - The label text to associate with the range. Use the "labelPlacement" property to control where the label is placed relative to the range.
 * @slot start - Content is placed to the left of the range slider in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the range slider in LTR, and to the left in RTL.
 *
 * @part tick - An inactive tick mark.
 * @part tick-active - An active tick mark.
 * @part pin - The counter that appears above a knob.
 * @part knob - The handle that is used to drag the range.
 * @part bar - The inactive part of the bar.
 * @part bar-active - The active part of the bar.
 * @part label - The label text describing the range.
 */
@Component({
  tag: 'ion-range',
  styleUrls: {
    ios: 'range.ios.scss',
    md: 'range.md.scss',
    ionic: 'range.md.scss',
  },
  shadow: true,
})
export class Range implements ComponentInterface {
  private rangeId = `ion-r-${rangeIds++}`;
  private didLoad = false;
  private noUpdate = false;
  private rect!: ClientRect;
  private hasFocus = false;
  private rangeSlider?: HTMLElement;
  private gesture?: Gesture;
  private inheritedAttributes: Attributes = {};
  private contentEl: HTMLElement | null = null;
  private initialContentScrollY = true;
  private originalIonInput?: EventEmitter<RangeChangeEventDetail>;
  private legacyFormController!: LegacyFormController;

  // This flag ensures we log the deprecation warning at most once.
  private hasLoggedDeprecationWarning = false;

  @Element() el!: HTMLIonRangeElement;

  @State() private ratioA = 0;
  @State() private ratioB = 0;
  @State() private pressedKnob: KnobName;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * How long, in milliseconds, to wait to trigger the
   * `ionInput` event after each change in the range value.
   */
  @Prop() debounce?: number;

  @Watch('debounce')
  protected debounceChanged() {
    const { ionInput, debounce, originalIonInput } = this;
    /**
     * If debounce is undefined, we have to manually revert the ionInput emitter in case
     * debounce used to be set to a number. Otherwise, the event would stay debounced.
     */
    this.ionInput = debounce === undefined ? originalIonInput ?? ionInput : debounceEvent(ionInput, debounce);
  }

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name = this.rangeId;

  /**
   * The text to display as the control's label. Use this over the `label` slot if
   * you only need plain text. The `label` property will take priority over the
   * `label` slot if both are used.
   */
  @Prop() label?: string;

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
   * A callback used to format the pin text.
   * By default the pin text is set to `Math.round(value)`.
   *
   * See https://ionicframework.com/docs/troubleshooting/runtime#accessing-this
   * if you need to access `this` from within the callback.
   */
  @Prop() pinFormatter: PinFormatter = (value: number): number => Math.round(value);

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
   * If `true`, tick marks are displayed based on the step value.
   * Only applies when `snaps` is `true`.
   */
  @Prop() ticks = true;

  /**
   * The start position of the range active bar. This feature is only available with a single knob (dualKnobs="false").
   * Valid values are greater than or equal to the min value and less than or equal to the max value.
   */
  @Prop({ mutable: true }) activeBarStart?: number;
  @Watch('activeBarStart')
  protected activeBarStartChanged() {
    const { activeBarStart } = this;
    if (activeBarStart !== undefined) {
      if (activeBarStart > this.max) {
        printIonWarning(
          `Range: The value of activeBarStart (${activeBarStart}) is greater than the max (${this.max}). Valid values are greater than or equal to the min value and less than or equal to the max value.`,
          this.el
        );
        this.activeBarStart = this.max;
      } else if (activeBarStart < this.min) {
        printIonWarning(
          `Range: The value of activeBarStart (${activeBarStart}) is less than the min (${this.min}). Valid values are greater than or equal to the min value and less than or equal to the max value.`,
          this.el
        );
        this.activeBarStart = this.min;
      }
    }
  }

  /**
   * If `true`, the user cannot interact with the range.
   */
  @Prop() disabled = false;
  @Watch('disabled')
  protected disabledChanged() {
    if (this.gesture) {
      this.gesture.enable(!this.disabled);
    }
    this.emitStyle();
  }

  /**
   * the value of the range.
   */
  @Prop({ mutable: true }) value: RangeValue = 0;
  @Watch('value')
  protected valueChanged() {
    if (!this.noUpdate) {
      this.updateRatio();
    }
  }

  private clampBounds = (value: any): number => {
    return clamp(this.min, value, this.max);
  };

  private ensureValueInBounds = (value: any) => {
    if (this.dualKnobs) {
      return {
        lower: this.clampBounds(value.lower),
        upper: this.clampBounds(value.upper),
      };
    } else {
      return this.clampBounds(value);
    }
  };

  /**
   * Where to place the label relative to the range.
   * `"start"`: The label will appear to the left of the range in LTR and to the right in RTL.
   * `"end"`: The label will appear to the right of the range in LTR and to the left in RTL.
   * `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("...").
   * `"stacked"`: The label will appear above the range regardless of the direction.
   */
  @Prop() labelPlacement: 'start' | 'end' | 'fixed' | 'stacked' = 'start';

  /**
   * Set the `legacy` property to `true` to forcibly use the legacy form control markup.
   * Ionic will only opt components in to the modern form markup when they are
   * using either the `aria-label` attribute or the `label` property. As a result,
   * the `legacy` property should only be used as an escape hatch when you want to
   * avoid this automatic opt-in behavior.
   * Note that this property will be removed in an upcoming major release
   * of Ionic, and all form components will be opted-in to using the modern form markup.
   */
  @Prop() legacy?: boolean;

  /**
   * The `ionChange` event is fired for `<ion-range>` elements when the user
   * modifies the element's value:
   * - When the user releases the knob after dragging;
   * - When the user moves the knob with keyboard arrows
   *
   * `ionChange` is not fired when the value is changed programmatically.
   */
  @Event() ionChange!: EventEmitter<RangeChangeEventDetail>;

  /**
   * The `ionInput` event is fired for `<ion-range>` elements when the value
   * is modified. Unlike `ionChange`, `ionInput` is fired continuously
   * while the user is dragging the knob.
   */
  @Event() ionInput!: EventEmitter<RangeChangeEventDetail>;

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

  /**
   * Emitted when the user starts moving the range knob, whether through
   * mouse drag, touch gesture, or keyboard interaction.
   */
  @Event() ionKnobMoveStart!: EventEmitter<RangeKnobMoveStartEventDetail>;

  /**
   * Emitted when the user finishes moving the range knob, whether through
   * mouse drag, touch gesture, or keyboard interaction.
   */
  @Event() ionKnobMoveEnd!: EventEmitter<RangeKnobMoveEndEventDetail>;

  private setupGesture = async () => {
    const rangeSlider = this.rangeSlider;
    if (rangeSlider) {
      this.gesture = (await import('../../utils/gesture')).createGesture({
        el: rangeSlider,
        gestureName: 'range',
        gesturePriority: 100,
        threshold: 0,
        onStart: (ev) => this.onStart(ev),
        onMove: (ev) => this.onMove(ev),
        onEnd: (ev) => this.onEnd(ev),
      });
      this.gesture.enable(!this.disabled);
    }
  };

  componentWillLoad() {
    /**
     * If user has custom ID set then we should
     * not assign the default incrementing ID.
     */
    if (this.el.hasAttribute('id')) {
      this.rangeId = this.el.getAttribute('id')!;
    }

    this.inheritedAttributes = inheritAriaAttributes(this.el);
  }

  componentDidLoad() {
    this.originalIonInput = this.ionInput;
    this.setupGesture();
    this.updateRatio();
    this.didLoad = true;
  }

  connectedCallback() {
    const { el } = this;

    this.legacyFormController = createLegacyFormController(el);

    this.updateRatio();
    this.debounceChanged();
    this.disabledChanged();
    this.activeBarStartChanged();

    /**
     * If we have not yet rendered
     * ion-range, then rangeSlider is not defined.
     * But if we are moving ion-range via appendChild,
     * then rangeSlider will be defined.
     */
    if (this.didLoad) {
      this.setupGesture();
    }

    this.contentEl = findClosestIonContent(this.el);
  }

  disconnectedCallback() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }

  private handleKeyboard = (knob: KnobName, isIncrease: boolean) => {
    const { ensureValueInBounds } = this;

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

    this.ionKnobMoveStart.emit({ value: ensureValueInBounds(this.value) });
    this.updateValue();
    this.emitValueChange();
    this.ionKnobMoveEnd.emit({ value: ensureValueInBounds(this.value) });
  };
  private getValue(): RangeValue {
    const value = this.value ?? 0;
    if (this.dualKnobs) {
      if (typeof value === 'object') {
        return value;
      }
      return {
        lower: 0,
        upper: value,
      };
    } else {
      if (typeof value === 'object') {
        return value.upper;
      }
      return value;
    }
  }

  // TODO FW-2997 remove this
  private emitStyle() {
    if (this.legacyFormController.hasLegacyControl()) {
      this.ionStyle.emit({
        interactive: true,
        'interactive-disabled': this.disabled,
        // TODO(FW-2997): remove this
        legacy: !!this.legacy,
      });
    }
  }

  /**
   * Emits an `ionChange` event.
   *
   * This API should be called for user committed changes.
   * This API should not be used for external value changes.
   */
  private emitValueChange() {
    this.value = this.ensureValueInBounds(this.value);
    this.ionChange.emit({ value: this.value });
  }

  private onStart(detail: GestureDetail) {
    const { contentEl } = this;
    if (contentEl) {
      this.initialContentScrollY = disableContentScrollY(contentEl);
    }

    const rect = (this.rect = this.rangeSlider!.getBoundingClientRect() as any);
    const currentX = detail.currentX;

    // figure out which knob they started closer to
    let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
    if (isRTL(this.el)) {
      ratio = 1 - ratio;
    }

    this.pressedKnob = !this.dualKnobs || Math.abs(this.ratioA - ratio) < Math.abs(this.ratioB - ratio) ? 'A' : 'B';

    this.setFocus(this.pressedKnob);

    // update the active knob's position
    this.update(currentX);

    this.ionKnobMoveStart.emit({ value: this.ensureValueInBounds(this.value) });
  }

  private onMove(detail: GestureDetail) {
    this.update(detail.currentX);
  }

  private onEnd(detail: GestureDetail) {
    const { contentEl, initialContentScrollY } = this;
    if (contentEl) {
      resetContentScrollY(contentEl, initialContentScrollY);
    }

    this.update(detail.currentX);
    this.pressedKnob = undefined;

    this.emitValueChange();
    this.ionKnobMoveEnd.emit({ value: this.ensureValueInBounds(this.value) });
  }

  private update(currentX: number) {
    // figure out where the pointer is currently at
    // update the knob being interacted with
    const rect = this.rect;
    let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
    if (isRTL(this.el)) {
      ratio = 1 - ratio;
    }

    if (this.snaps) {
      // snaps the ratio to the current value
      ratio = valueToRatio(ratioToValue(ratio, this.min, this.max, this.step), this.min, this.max);
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
    const { activeBarStart } = this;
    if (activeBarStart == null) {
      return 0;
    }
    return valueToRatio(activeBarStart, this.min, this.max);
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
          upper: Math.max(valA, valB),
        };

    this.ionInput.emit({ value: this.value });

    this.noUpdate = false;
  }

  private setFocus(knob: KnobName) {
    if (this.el.shadowRoot) {
      const knobEl = this.el.shadowRoot.querySelector(knob === 'A' ? '.range-knob-a' : '.range-knob-b') as
        | HTMLElement
        | undefined;
      if (knobEl) {
        knobEl.focus();
      }
    }
  }

  private onBlur = () => {
    if (this.hasFocus) {
      this.hasFocus = false;
      this.ionBlur.emit();
      this.emitStyle();
    }
  };

  private onFocus = () => {
    if (!this.hasFocus) {
      this.hasFocus = true;
      this.ionFocus.emit();
      this.emitStyle();
    }
  };

  // TODO FW-2997 remove this
  private renderLegacyRange() {
    if (!this.hasLoggedDeprecationWarning) {
      printIonWarning(
        `ion-range now requires providing a label with either the label slot or the "aria-label" attribute. To migrate, remove any usage of "ion-label" and pass the label text to either the component or the "aria-label" attribute.

Example: <ion-range><div slot="label">Volume</div></ion-range>
Example with aria-label: <ion-range aria-label="Volume"></ion-range>

Developers can use the "legacy" property to continue using the legacy form markup. This property will be removed in an upcoming major release of Ionic where this form control will use the modern form markup.`,
        this.el
      );

      if (this.legacy) {
        printIonWarning(
          `ion-range is being used with the "legacy" property enabled which will forcibly enable the legacy form markup. This property will be removed in an upcoming major release of Ionic where this form control will use the modern form markup.

Developers can dismiss this warning by removing their usage of the "legacy" property and using the new range syntax.`,
          this.el
        );
      }

      this.hasLoggedDeprecationWarning = true;
    }

    const { el, pressedKnob, disabled, pin, rangeId } = this;

    const theme = getIonTheme(this);

    renderHiddenInput(true, el, this.name, JSON.stringify(this.getValue()), disabled);

    return (
      <Host
        onFocusin={this.onFocus}
        onFocusout={this.onBlur}
        id={rangeId}
        class={createColorClasses(this.color, {
          [theme]: true,
          'in-item': hostContext('ion-item', el),
          'range-disabled': disabled,
          'range-pressed': pressedKnob !== undefined,
          'range-has-pin': pin,
          'legacy-range': true,
        })}
      >
        <slot name="start"></slot>
        {this.renderRangeSlider()}
        <slot name="end"></slot>
      </Host>
    );
  }

  /**
   * Returns true if content was passed to the "start" slot
   */
  private get hasStartSlotContent() {
    return this.el.querySelector('[slot="start"]') !== null;
  }

  /**
   * Returns true if content was passed to the "end" slot
   */
  private get hasEndSlotContent() {
    return this.el.querySelector('[slot="end"]') !== null;
  }

  private renderRange() {
    const { disabled, el, hasLabel, rangeId, pin, pressedKnob, labelPlacement, label } = this;

    const inItem = hostContext('ion-item', el);

    /**
     * If there is no start content then the knob at
     * the min value will be cut off by the item margin.
     */
    const hasStartContent =
      (hasLabel && (labelPlacement === 'start' || labelPlacement === 'fixed')) || this.hasStartSlotContent;

    const needsStartAdjustment = inItem && !hasStartContent;

    /**
     * If there is no end content then the knob at
     * the max value will be cut off by the item margin.
     */
    const hasEndContent = (hasLabel && labelPlacement === 'end') || this.hasEndSlotContent;

    const needsEndAdjustment = inItem && !hasEndContent;

    const theme = getIonTheme(this);

    renderHiddenInput(true, el, this.name, JSON.stringify(this.getValue()), disabled);

    return (
      <Host
        onFocusin={this.onFocus}
        onFocusout={this.onBlur}
        id={rangeId}
        class={createColorClasses(this.color, {
          [theme]: true,
          'in-item': inItem,
          'range-disabled': disabled,
          'range-pressed': pressedKnob !== undefined,
          'range-has-pin': pin,
          [`range-label-placement-${labelPlacement}`]: true,
          'range-item-start-adjustment': needsStartAdjustment,
          'range-item-end-adjustment': needsEndAdjustment,
        })}
      >
        <label class="range-wrapper" id="range-label">
          <div
            class={{
              'label-text-wrapper': true,
              'label-text-wrapper-hidden': !hasLabel,
            }}
            part="label"
          >
            {label !== undefined ? <div class="label-text">{label}</div> : <slot name="label"></slot>}
          </div>
          <div class="native-wrapper">
            <slot name="start"></slot>
            {this.renderRangeSlider()}
            <slot name="end"></slot>
          </div>
        </label>
      </Host>
    );
  }

  private get hasLabel() {
    return this.label !== undefined || this.el.querySelector('[slot="label"]') !== null;
  }

  private renderRangeSlider() {
    const {
      min,
      max,
      step,
      el,
      handleKeyboard,
      pressedKnob,
      disabled,
      pin,
      ratioLower,
      ratioUpper,
      inheritedAttributes,
      rangeId,
      pinFormatter,
    } = this;

    /**
     * Look for external label, ion-label, or aria-labelledby.
     * If none, see if user placed an aria-label on the host
     * and use that instead.
     */
    let { labelText } = getAriaLabel(el, rangeId!);
    if (labelText === undefined || labelText === null) {
      labelText = inheritedAttributes['aria-label'];
    }

    let barStart = `${ratioLower * 100}%`;
    let barEnd = `${100 - ratioUpper * 100}%`;

    const rtl = isRTL(this.el);

    const start = rtl ? 'right' : 'left';
    const end = rtl ? 'left' : 'right';

    const tickStyle = (tick: any) => {
      return {
        [start]: tick[start],
      };
    };

    if (this.dualKnobs === false) {
      /**
       * When the value is less than the activeBarStart or the min value,
       * the knob will display at the start of the active bar.
       */
      if (this.valA < (this.activeBarStart ?? this.min)) {
        /**
         * Sets the bar positions relative to the upper and lower limits.
         * Converts the ratio values into percentages, used as offsets for left/right styles.
         *
         * The ratioUpper refers to the knob position on the bar.
         * The ratioLower refers to the end position of the active bar (the value).
         */
        barStart = `${ratioUpper * 100}%`;
        barEnd = `${100 - ratioLower * 100}%`;
      } else {
        /**
         * Otherwise, the knob will display at the end of the active bar.
         *
         * The ratioLower refers to the start position of the active bar (the value).
         * The ratioUpper refers to the knob position on the bar.
         */
        barStart = `${ratioLower * 100}%`;
        barEnd = `${100 - ratioUpper * 100}%`;
      }
    }

    const barStyle = {
      [start]: barStart,
      [end]: barEnd,
    };

    const ticks = [];
    if (this.snaps && this.ticks) {
      for (let value = min; value <= max; value += step) {
        const ratio = valueToRatio(value, min, max);

        const ratioMin = Math.min(ratioLower, ratioUpper);
        const ratioMax = Math.max(ratioLower, ratioUpper);

        const tick: any = {
          ratio,
          /**
           * Sets the tick mark as active when the tick is between the min bounds and the knob.
           * When using activeBarStart, the tick mark will be active between the knob and activeBarStart.
           */
          active: ratio >= ratioMin && ratio <= ratioMax,
        };

        tick[start] = `${ratio * 100}%`;

        ticks.push(tick);
      }
    }

    let labelledBy: string | undefined;
    if (!this.legacyFormController.hasLegacyControl() && this.hasLabel) {
      labelledBy = 'range-label';
    }

    return (
      <div class="range-slider" ref={(rangeEl) => (this.rangeSlider = rangeEl)}>
        {ticks.map((tick) => (
          <div
            style={tickStyle(tick)}
            role="presentation"
            class={{
              'range-tick': true,
              'range-tick-active': tick.active,
            }}
            part={tick.active ? 'tick-active' : 'tick'}
          />
        ))}

        <div class="range-bar-container">
          <div class="range-bar" role="presentation" part="bar" />
          <div
            class={{
              'range-bar': true,
              'range-bar-active': true,
              'has-ticks': ticks.length > 0,
            }}
            role="presentation"
            style={barStyle}
            part="bar-active"
          />
        </div>

        {renderKnob(rtl, {
          knob: 'A',
          pressed: pressedKnob === 'A',
          value: this.valA,
          ratio: this.ratioA,
          pin,
          pinFormatter,
          disabled,
          handleKeyboard,
          min,
          max,
          labelText,
          labelledBy,
        })}

        {this.dualKnobs &&
          renderKnob(rtl, {
            knob: 'B',
            pressed: pressedKnob === 'B',
            value: this.valB,
            ratio: this.ratioB,
            pin,
            pinFormatter,
            disabled,
            handleKeyboard,
            min,
            max,
            labelText,
            labelledBy,
          })}
      </div>
    );
  }

  render() {
    const { legacyFormController } = this;
    return legacyFormController.hasLegacyControl() ? this.renderLegacyRange() : this.renderRange();
  }
}

interface RangeKnob {
  knob: KnobName;
  value: number;
  ratio: number;
  min: number;
  max: number;
  disabled: boolean;
  pressed: boolean;
  pin: boolean;
  pinFormatter: PinFormatter;
  labelText?: string | null;
  labelledBy?: string;
  handleKeyboard: (name: KnobName, isIncrease: boolean) => void;
}

const renderKnob = (
  rtl: boolean,
  {
    knob,
    value,
    ratio,
    min,
    max,
    disabled,
    pressed,
    pin,
    handleKeyboard,
    labelText,
    labelledBy,
    pinFormatter,
  }: RangeKnob
) => {
  const start = rtl ? 'right' : 'left';

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
        'ion-activatable': true,
        'ion-focusable': true,
      }}
      style={knobStyle()}
      role="slider"
      tabindex={disabled ? -1 : 0}
      aria-label={labelledBy === undefined ? labelText : null}
      aria-labelledby={labelledBy !== undefined ? labelledBy : null}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-disabled={disabled ? 'true' : null}
      aria-valuenow={value}
    >
      {pin && (
        <div class="range-pin" role="presentation" part="pin">
          {pinFormatter(value)}
        </div>
      )}
      <div class="range-knob" role="presentation" part="knob" />
    </div>
  );
};

const ratioToValue = (ratio: number, min: number, max: number, step: number): number => {
  let value = (max - min) * ratio;

  if (step > 0) {
    // round to nearest multiple of step, then add min
    value = Math.round(value / step) * step + min;
  }
  const clampedValue = clamp(min, value, max);

  return roundToMaxDecimalPlaces(clampedValue, min, max, step);
};

const valueToRatio = (value: number, min: number, max: number): number => {
  return clamp(0, (value - min) / (max - min), 1);
};

let rangeIds = 0;
