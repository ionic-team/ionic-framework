import { Component, Element, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { CheckboxInput, CheckedInputChangeEvent, Color, Mode, StyleEvent } from '../../interface';
import { deferEvent } from '../../utils/helpers';
import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-checkbox',
  styleUrls: {
    ios: 'checkbox.ios.scss',
    md: 'checkbox.md.scss'
  }
})
export class Checkbox implements CheckboxInput {

  private inputId = `ion-cb-${checkboxIds++}`;
  private labelId = `${this.inputId}-lbl`;

  @Element() el!: HTMLElement;

  @State() keyFocus = false;

  /**
   * The color to use for the checkbox.
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * If true, the checkbox is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * If true, the user cannot interact with the checkbox. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * The value of the checkbox.
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

  componentDidLoad() {
    this.ionStyle = deferEvent(this.ionStyle);
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
      'checkbox-disabled': this.disabled,
      'checkbox-checked': this.checked,
    });
  }

  onChange() {
    this.checked = !this.checked;
  }

  onKeyUp() {
    this.keyFocus = true;
  }

  onFocus() {
    this.ionFocus.emit();
  }

  onBlur() {
    this.keyFocus = false;
    this.ionBlur.emit();
  }

  hostData() {
    return {
      class: {
        ...createThemedClasses(this.mode, this.color, 'checkbox'),

        'checkbox-checked': this.checked,
        'checkbox-disabled': this.disabled,
        'checkbox-key': this.keyFocus
      }
    };
  }

  render() {
    return [
      <div class="checkbox-icon">
        <div class="checkbox-inner"></div>
      </div>,
      <input
        type="checkbox"
        id={this.inputId}
        aria-labelledby={this.labelId}
        onChange={this.onChange.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
        checked={this.checked}
        name={this.name}
        value={this.value}
        disabled={this.disabled} />
    ];
  }
}

let checkboxIds = 0;
