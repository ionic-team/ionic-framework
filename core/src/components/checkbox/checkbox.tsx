import { Component, ComponentInterface, Element, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';

import { CheckedInputChangeEvent, Color, Mode, StyleEvent } from '../../interface';
import { renderHiddenInput } from '../../utils/helpers';
import { createColorClasses, hostContext } from '../../utils/theme';

@Component({
  tag: 'ion-checkbox',
  styleUrls: {
    ios: 'checkbox.ios.scss',
    md: 'checkbox.md.scss'
  },
  shadow: true
})
export class Checkbox implements ComponentInterface {

  private inputId = `ion-cb-${checkboxIds++}`;
  private labelId = `${this.inputId}-lbl`;

  @Element() el!: HTMLElement;

  @State() keyFocus = false;

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
   * If `true`, the checkbox is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * If `true`, the user cannot interact with the checkbox. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * The value of the toggle does not mean if it's checked or not, use the `checked`
   * property for that.
   *
   * The value of a toggle is analogous to the value of a `<input type="checkbox">`,
   * it's only used when the toggle participates in a native `<form>`.
   * Defaults to `on`.
   */
  @Prop() value = 'on';

  /**
   * Emitted when the checked property has changed.
   */
  @Event() ionChange!: EventEmitter<CheckedInputChangeEvent>;

  /**
   * Emitted when the toggle has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the toggle loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle!: EventEmitter<StyleEvent>;

  componentWillLoad() {
    this.emitStyle();
  }

  @Watch('checked')
  checkedChanged(isChecked: boolean) {
    this.ionChange.emit({
      checked: isChecked,
      value: this.value
    });
    this.emitStyle();
  }

  @Watch('disabled')
  emitStyle() {
    this.ionStyle.emit({
      'checkbox-checked': this.checked,
      'interactive-disabled': this.disabled,
    });
  }

  private onChange = () => {
    this.checked = !this.checked;
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
    return {
      class: {
        ...createColorClasses(this.color),
        'in-item': hostContext('ion-item', this.el),
        'checkbox-checked': this.checked,
        'checkbox-disabled': this.disabled,
        'checkbox-key': this.keyFocus,
        'interactive': true
      }
    };
  }

  render() {
    renderHiddenInput(this.el, this.name, this.value, this.disabled);

    return [
      <svg class="checkbox-icon" viewBox="0 0 24 24">
        { this.mode === 'md'
          ? <path d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          : <path d="M5.9,12.5l3.8,3.8l8.8-8.8"/>
        }
      </svg>,
      <input
        type="checkbox"
        id={this.inputId}
        aria-labelledby={this.labelId}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyUp={this.onKeyUp}
        checked={this.checked}
        name={this.name}
        value={this.value}
        disabled={this.disabled}
      />
    ];
  }
}

let checkboxIds = 0;
