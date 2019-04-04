import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, Watch } from '@stencil/core';

import { CheckboxChangeEventDetail, Color, Mode, StyleEventDetail } from '../../interface';
import { findItemLabel, renderHiddenInput } from '../../utils/helpers';
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
  private buttonEl?: HTMLElement;

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
   * If `true`, the checkbox is selected.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * If `true`, the checkbox will visually appear as indeterminate.
   */
  @Prop({ mutable: true }) indeterminate = false;

  /**
   * If `true`, the user cannot interact with the checkbox.
   */
  @Prop() disabled = false;

  /**
   * The value of the toggle does not mean if it's checked or not, use the `checked`
   * property for that.
   *
   * The value of a toggle is analogous to the value of a `<input type="checkbox">`,
   * it's only used when the toggle participates in a native `<form>`.
   */
  @Prop() value = 'on';

  /**
   * Emitted when the checked property has changed.
   */
  @Event() ionChange!: EventEmitter<CheckboxChangeEventDetail>;

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
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

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

  @Listen('click')
  onClick() {
    this.setFocus();
    this.checked = !this.checked;
    this.indeterminate = false;
  }

  private setFocus() {
    if (this.buttonEl) {
      this.buttonEl.focus();
    }
  }

  private onFocus = () => {
    this.ionFocus.emit();
  }

  private onBlur = () => {
    this.ionBlur.emit();
  }

  hostData() {
    const { inputId, disabled, checked, color, el } = this;
    const labelId = inputId + '-lbl';
    const label = findItemLabel(el);
    if (label) {
      label.id = labelId;
    }
    return {
      'role': 'checkbox',
      'aria-disabled': disabled ? 'true' : null,
      'aria-checked': `${checked}`,
      'aria-labelledby': labelId,
      class: {
        ...createColorClasses(color),
        'in-item': hostContext('ion-item', el),
        'checkbox-checked': checked,
        'checkbox-disabled': disabled,
        'checkbox-indeterminate': this.indeterminate,
        'interactive': true
      }
    };
  }

  render() {
    renderHiddenInput(true, this.el, this.name, (this.checked ? this.value : ''), this.disabled);

    let path = this.indeterminate
      ? <path d="M6 12L18 12"/>
      : <path d="M5.9,12.5l3.8,3.8l8.8-8.8" />;

    if (this.mode === 'md') {
      path = this.indeterminate
        ? <path d="M2 12H22"/>
        : <path d="M1.73,12.91 8.1,19.28 22.79,4.59"/>;
    }

    return [
      <svg class="checkbox-icon" viewBox="0 0 24 24">
        {path}
      </svg>,
      <button
        type="button"
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        disabled={this.disabled}
        ref={el => this.buttonEl = el}
      >
      </button>
    ];
  }
}

let checkboxIds = 0;
