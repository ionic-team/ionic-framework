import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, RadioChangeEventDetail, StyleEventDetail } from '../../interface';
import { findItemLabel } from '../../utils/helpers';
import { createColorClasses, hostContext } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-radio',
  styleUrls: {
    ios: 'radio.ios.scss',
    md: 'radio.md.scss'
  },
  shadow: true
})
export class Radio implements ComponentInterface {

  private inputId = `ion-rb-${radioButtonIds++}`;

  @Element() el!: HTMLElement;

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
   * If `true`, the radio is selected.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * the value of the radio.
   */
  @Prop({ mutable: true }) value?: any | null;

  /**
   * Emitted when the radio loads.
   * @internal
   */
  @Event() ionRadioDidLoad!: EventEmitter<void>;

  /**
   * Emitted when the radio unloads.
   * @internal
   */
  @Event() ionRadioDidUnload!: EventEmitter<void>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  /**
   * Emitted when the radio button is selected.
   */
  @Event() ionSelect!: EventEmitter<RadioChangeEventDetail>;

  /**
   * Emitted when checked radio button is selected.
   * @internal
   */
  @Event() ionDeselect!: EventEmitter<RadioChangeEventDetail>;

  /**
   * Emitted when the radio button has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the radio button loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  @Watch('color')
  colorChanged() {
    this.emitStyle();
  }

  @Watch('checked')
  checkedChanged(isChecked: boolean) {
    if (isChecked) {
      this.ionSelect.emit({
        checked: true,
        value: this.value
      });
    }
    this.emitStyle();
  }

  @Watch('disabled')
  disabledChanged() {
    this.emitStyle();
  }

  componentWillLoad() {
    if (this.value === undefined) {
      this.value = this.inputId;
    }
    this.emitStyle();
  }

  componentDidLoad() {
    this.ionRadioDidLoad.emit();
  }

  componentDidUnload() {
    this.ionRadioDidUnload.emit();
  }

  private emitStyle() {
    this.ionStyle.emit({
      'radio-checked': this.checked,
      'interactive-disabled': this.disabled,
    });
  }

  private onFocus = () => {
    this.ionFocus.emit();
  }

  private onBlur = () => {
    this.ionBlur.emit();
  }

  private onClick = () => {
    if (this.checked) {
      this.ionDeselect.emit();
    } else {
      this.checked = true;
    }
  }

  render() {
    const { inputId, disabled, checked, color, el } = this;
    const mode = getIonMode(this);
    const labelId = inputId + '-lbl';
    const label = findItemLabel(el);
    if (label) {
      label.id = labelId;
    }
    return (
      <Host
        onClick={this.onClick}
        role="radio"
        aria-disabled={disabled ? 'true' : null}
        aria-checked={`${checked}`}
        aria-labelledby={labelId}
        class={{
          ...createColorClasses(color),
          [mode]: true,
          'in-item': hostContext('ion-item', el),
          'interactive': true,
          'radio-checked': checked,
          'radio-disabled': disabled,
        }}
      >
        <div class="radio-icon">
          <div class="radio-inner"/>
        </div>
        <button
          type="button"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          disabled={disabled}
        >
        </button>
      </Host>
    );
  }
}

let radioButtonIds = 0;
