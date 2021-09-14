import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, MedColor, StyleEventDetail } from '../../interface';
import { addEventListener, getAriaLabel, removeEventListener } from '../../utils/helpers';
import { hostContext } from '../../utils/theme';
import { generateMedColor } from '../../utils/med-theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part container - The container for the radio mark.
 * @part mark - The checkmark or dot used to indicate the checked state.
 */
@Component({
  tag: 'ion-radio',
  styleUrls: {
    ios: './radio.md.scss',
    md: './radio.md.scss'
  },
  shadow: true
})
export class Radio implements ComponentInterface {
  private inputId = `ion-rb-${radioButtonIds++}`;
  private radioGroup: HTMLIonRadioGroupElement | null = null;

  @Element() el!: HTMLIonRadioElement;

  /**
   * Define a variação do componente.
   */
  @Prop({ reflect: true }) dsName?: 'secondary';

   /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

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
  @Prop() color?: Color;

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
    if (this.value === undefined) {
      this.value = this.inputId;
    }
    const radioGroup = this.radioGroup = this.el.closest('ion-radio-group');
    if (radioGroup) {
      this.updateState();
      addEventListener(radioGroup, 'ionChange', this.updateState);
    }
  }

  disconnectedCallback() {
    const radioGroup = this.radioGroup;
    if (radioGroup) {
      removeEventListener(radioGroup, 'ionChange', this.updateState);
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
  }

  private onFocus = () => {
    this.ionFocus.emit();
  }

  private onBlur = () => {
    this.ionBlur.emit();
  }

  render() {
    const { inputId, disabled, checked, dsColor, el, buttonTabindex, dsName } = this;
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
        class={generateMedColor(dsColor, {
          [mode]: true,
          'med-radio': true,
          [`med-radio--${dsName}`]: dsName !== undefined,
          'in-item': hostContext('ion-item', el) || hostContext('med-option', el),
          'interactive': true,
          'radio-checked': checked,
          'radio-disabled': disabled,
        })}
      >
        <div class="radio-icon" part="container">
          <div class="radio-inner" part="mark" />
          <div class="radio-ripple"></div>
        </div>
        <label htmlFor={inputId}>
          {labelText}
        </label>
        <input
          type="radio"
          checked={checked}
          disabled={disabled}
          tabindex="-1"
          id={inputId}
        />
      </Host>
    );
  }
}

let radioButtonIds = 0;
