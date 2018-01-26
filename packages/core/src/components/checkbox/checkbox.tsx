import { BlurEvent, CheckboxInput, CheckedInputChangeEvent, FocusEvent, StyleEvent } from '../../utils/input-interfaces';
import { Component, CssClassMap, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { debounce } from '../../utils/helpers';


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
  private didLoad: boolean;
  private inputId: string;
  private nativeInput: HTMLInputElement;

  @State() keyFocus: boolean;

  /**
   * The color to use.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string;

  /**
   * If true, the checkbox is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * If true, the user cannot interact with the checkbox. Default false.
   */
  @Prop() disabled = false;

  /**
   * the value of the checkbox.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * Emitted when the checked property has changed.
   */
  @Event() ionChange: EventEmitter<CheckedInputChangeEvent>;

  /**
   * Emitted when the toggle has focus.
   */
  @Event() ionFocus: EventEmitter<FocusEvent>;

  /**
   * Emitted when the toggle loses focus.
   */
  @Event() ionBlur: EventEmitter<BlurEvent>;

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter<StyleEvent>;

  componentWillLoad() {
    this.inputId = 'ion-cb-' + (checkboxIds++);
    if (this.value === undefined) {
      this.value = this.inputId;
    }
    this.emitStyle();
  }

  componentDidLoad() {
    this.ionStyle.emit = debounce(this.ionStyle.emit.bind(this.ionStyle));
    this.nativeInput.checked = this.checked;
    this.didLoad = true;

    const parentItem = this.nativeInput.closest('ion-item');
    if (parentItem) {
      const itemLabel = parentItem.querySelector('ion-label');
      if (itemLabel) {
        itemLabel.id = this.inputId + '-lbl';
        this.nativeInput.setAttribute('aria-labelledby', itemLabel.id);
      }
    }
  }

  @Watch('checked')
  checkedChanged(isChecked: boolean) {
    if (this.nativeInput.checked !== isChecked) {
      // keep the checked value and native input `nync
      this.nativeInput.checked = isChecked;
    }
    if (this.didLoad) {
      this.ionChange.emit({
        checked: isChecked,
        value: this.value
      });
    }
    this.emitStyle();
  }

  @Watch('disabled')
  disabledChanged(isDisabled: boolean) {
    this.nativeInput.disabled = isDisabled;
    this.emitStyle();
  }

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
        <div class='checkbox-inner'></div>
      </div>,
      <input
        type='checkbox'
        onChange={this.onChange.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
        id={this.inputId}
        name={this.name}
        value={this.value}
        disabled={this.disabled}
        ref={r => this.nativeInput = (r as any)}/>
    ];
  }
}

let checkboxIds = 0;
