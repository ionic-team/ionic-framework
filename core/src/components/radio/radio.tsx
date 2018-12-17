import { Component, ComponentInterface, Element, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';

import { CheckedInputChangeEvent, Color, Mode, StyleEvent } from '../../interface';
import { findItemLabel } from '../../utils/helpers';
import { createColorClasses, hostContext } from '../../utils/theme';

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

  @State() keyFocus = false;

  @Element() el!: HTMLElement;

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
   */
  @Event() ionRadioDidLoad!: EventEmitter<void>;

  /**
   * Emitted when the radio unloads.
   */
  @Event() ionRadioDidUnload!: EventEmitter<void>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEvent>;

  /**
   * Emitted when the radio button is selected.
   */
  @Event() ionSelect!: EventEmitter<CheckedInputChangeEvent>;

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

  private onClick = () => {
    this.checked = true;
  }

  private onKeyUp = () => {
    this.keyFocus = true;
  }

  private onFocus = () => {
    this.ionFocus.emit();
  }

  private onBlur = () => {
    this.keyFocus = false;
    this.ionBlur.emit();
  }

  hostData() {
    const labelId = this.inputId + '-lbl';
    const label = findItemLabel(this.el);
    if (label) {
      label.id = labelId;
    }
    return {
      'role': 'radio',
      'aria-disabled': this.disabled ? 'true' : null,
      'aria-checked': `${this.checked}`,
      'aria-labelledby': labelId,
      class: {
        ...createColorClasses(this.color),
        'in-item': hostContext('ion-item', this.el),
        'interactive': true,
        'radio-checked': this.checked,
        'radio-disabled': this.disabled,
        'radio-key': this.keyFocus
      }
    };
  }

  render() {
    return [
      <div class="radio-icon">
        <div class="radio-inner"/>
      </div>,
      <button
        type="button"
        onClick={this.onClick}
        onKeyUp={this.onKeyUp}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
      </button>,
    ];
  }
}

let radioButtonIds = 0;
