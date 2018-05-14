import { Component, Element, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { CheckboxInput, CheckedInputChangeEvent, Color, CssClassMap, Mode, StyleEvent } from '../../interface';
import { deferEvent } from '../../utils/helpers';


@Component({
  tag: 'ion-checkbox',
  styleUrls: {
    ios: 'checkbox.ios.scss',
    md: 'checkbox.md.scss'
  },
  host: {
    theme: 'checkbox'
  }
})
export class Checkbox implements CheckboxInput {

  private inputId = `ion-cb-${checkboxIds++}`;
  private labelId = `${this.inputId}-lbl`;

  @Element() el!: HTMLElement;

  @State() keyFocus = false;

  /**
   * The color to use.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
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
   * the value of the checkbox.
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
        'checkbox-checked': this.checked,
        'checkbox-disabled': this.disabled,
        'checkbox-key': this.keyFocus
      }
    };
  }

  render() {
    const checkboxClasses: CssClassMap = {
      'checkbox-icon': true,
      'checkbox-checked': this.checked
    };

    return [
      <div class={checkboxClasses}>
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
