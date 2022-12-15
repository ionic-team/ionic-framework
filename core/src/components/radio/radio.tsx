import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import type { Color, StyleEventDetail } from '../../interface';
import type { LegacyFormController } from '../../utils/forms';
import { createLegacyFormController } from '../../utils/forms';
import { addEventListener, getAriaLabel, removeEventListener } from '../../utils/helpers';
import { printIonWarning } from '../../utils/logging';
import { createColorClasses, hostContext } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - The label text to associate with the radio. Use the "labelPlacement" property to control where the label is placed relative to the radio.
 *
 * @part container - The container for the radio mark.
 * @part mark - The checkmark or dot used to indicate the checked state.
 */
@Component({
  tag: 'ion-radio',
  styleUrls: {
    ios: 'radio.ios.scss',
    md: 'radio.md.scss',
  },
  shadow: true,
})
export class Radio implements ComponentInterface {
  private inputId = `ion-rb-${radioButtonIds++}`;
  private radioGroup: HTMLIonRadioGroupElement | null = null;
  private nativeInput!: HTMLInputElement;
  private legacyFormController!: LegacyFormController;

  // This flag ensures we log the deprecation warning at most once.
  private hasLoggedDeprecationWarning = false;

  @Element() el!: HTMLIonRadioElement;

  /**
   * If `true`, the radio is selected.
   */
  @State() checked = false;

  /**
   * The tabindex of the radio button.
   * @internal
   */
  @State() buttonTabindex = -1;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * If `true`, the user cannot interact with the radio.
   */
  @Prop() disabled = false;

  /**
   * the value of the radio.
   */
  @Prop() value?: any | null;

  /**
   * Where to place the label relative to the radio.
   * `'start'`: The label will appear to the left of the radio in LTR and to the right in RTL.
   * `'end'`: The label will appear to the right of the radio in LTR and to the left in RTL.
   * `'fixed'`: The label has the same behavior as `'start'` except it also has a fixed width. Long text will be truncated with ellipses ("...").
   */
  @Prop() labelPlacement: 'start' | 'end' | 'fixed' = 'start';

  /**
   * How to pack the label and radio within a line.
   * `'start'`: The label and radio will appear on the left in LTR and
   * on the right in RTL.
   * `'end'`: The label and radio will appear on the right in LTR and
   * on the left in RTL.
   * `'space-between'`: The label and radio will appear on opposite
   * ends of the line with space between the two elements.
   */
  @Prop() justify: 'start' | 'end' | 'space-between' = 'space-between';

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  /**
   * Emitted when the radio button has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the radio button loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /** @internal */
  @Method()
  async setFocus(ev: any) {
    ev.stopPropagation();
    ev.preventDefault();

    this.el.focus();
  }

  /** @internal */
  @Method()
  async setButtonTabindex(value: number) {
    this.buttonTabindex = value;
  }

  connectedCallback() {
    this.legacyFormController = createLegacyFormController(this.el);
    if (this.value === undefined) {
      this.value = this.inputId;
    }
    const radioGroup = (this.radioGroup = this.el.closest('ion-radio-group'));
    if (radioGroup) {
      this.updateState();
      addEventListener(radioGroup, 'ionValueChange', this.updateState);
    }
  }

  disconnectedCallback() {
    const radioGroup = this.radioGroup;
    if (radioGroup) {
      removeEventListener(radioGroup, 'ionValueChange', this.updateState);
      this.radioGroup = null;
    }
  }

  componentWillLoad() {
    this.emitStyle();
  }

  @Watch('color')
  @Watch('checked')
  @Watch('disabled')
  emitStyle() {
    this.ionStyle.emit({
      'radio-checked': this.checked,
      'interactive-disabled': this.disabled,
    });
  }

  private updateState = () => {
    if (this.radioGroup) {
      this.checked = this.radioGroup.value === this.value;
    }
  };

  private onClick = () => {
    this.checked = this.nativeInput.checked;
  };

  private onFocus = () => {
    this.ionFocus.emit();
  };

  private onBlur = () => {
    this.ionBlur.emit();
  };

  render() {
    const { legacyFormController } = this;

    return legacyFormController.hasLegacyControl() ? this.renderLegacyRadio() : this.renderRadio();
  }

  private renderRadio() {
    return <slot></slot>;
  }

  private renderLegacyRadio() {
    if (!this.hasLoggedDeprecationWarning) {
      printIonWarning(
        `Using ion-radio with an ion-label has been deprecated. To migrate, remove the ion-label and pass your label directly into ion-radio instead.
Example: <ion-radio>Option Label:</ion-radio>
For radios that do not have a visible label, developers should use "aria-label" so screen readers can announce the purpose of the radio.`,
        this.el
      );
      this.hasLoggedDeprecationWarning = true;
    }

    const { inputId, disabled, checked, color, el, buttonTabindex } = this;
    const mode = getIonMode(this);
    const { label, labelId, labelText } = getAriaLabel(el, inputId);

    return (
      <Host
        aria-checked={`${checked}`}
        aria-hidden={disabled ? 'true' : null}
        aria-labelledby={label ? labelId : null}
        role="radio"
        tabindex={buttonTabindex}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onClick={this.onClick}
        class={createColorClasses(color, {
          [mode]: true,
          'in-item': hostContext('ion-item', el),
          interactive: true,
          'radio-checked': checked,
          'radio-disabled': disabled,
        })}
      >
        <div class="radio-icon" part="container">
          <div class="radio-inner" part="mark" />
          <div class="radio-ripple"></div>
        </div>
        <label htmlFor={inputId}>{labelText}</label>
        <input
          type="radio"
          checked={checked}
          disabled={disabled}
          tabindex="-1"
          id={inputId}
          ref={(nativeEl) => (this.nativeInput = nativeEl as HTMLInputElement)}
        />
      </Host>
    );
  }
}

let radioButtonIds = 0;
