import { BlurEvent, CheckedInputChangeEvent, FocusEvent, RadioButtonInput, StyleEvent } from '../../utils/input-interfaces';
import { Component, ComponentDidLoad, ComponentDidUnload, ComponentWillLoad, CssClassMap, Event, EventEmitter, Prop, PropDidChange, State } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-radio',
  styleUrls: {
    ios: 'radio.ios.scss',
    md: 'radio.md.scss'
  },
  host: {
    theme: 'radio'
  }
})
export class Radio implements RadioButtonInput, ComponentDidLoad, ComponentDidUnload, ComponentWillLoad {
  private didLoad: boolean;
  private inputId: string;
  private nativeInput: HTMLInputElement;
  private styleTmr: any;


  @State() keyFocus: boolean;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   */
  @Prop() name: string;

  /*
   * @input {boolean} If true, the user cannot interact with the radio. Default false.
   */
  @Prop() disabled = false;

  /**
   * @input {boolean} If true, the radio is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * @input {string} the value of the radio.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * @output {RadioEvent} Emitted when the radio loads.
   */
  @Event() ionRadioDidLoad: EventEmitter;

  /**
   * @output {RadioEvent} Emitted when the radio unloads.
   */
  @Event() ionRadioDidUnload: EventEmitter;

  /**
   * @output {Event} Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter<StyleEvent>;

  /**
   * @output {Event} Emitted when the radio button is selected.
   */
  @Event() ionSelect: EventEmitter<CheckedInputChangeEvent>;

  /**
   * @output {Event} Emitted when the radio button has focus.
   */
  @Event() ionFocus: EventEmitter<FocusEvent>;

  /**
   * @output {Event} Emitted when the radio button loses focus.
   */
  @Event() ionBlur: EventEmitter<BlurEvent>;


  componentWillLoad() {
    this.inputId = 'ion-rb-' + (radioButtonIds++);
    if (this.value === undefined) {
      this.value = this.inputId;
    }
    this.emitStyle();
  }

  componentDidLoad() {
    this.ionRadioDidLoad.emit({ radio: this });
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

  componentDidUnload() {
    this.ionRadioDidUnload.emit({ radio: this });
  }

  @PropDidChange('color')
  colorChanged() {
    this.emitStyle();
  }

  @PropDidChange('checked')
  checkedChanged(isChecked: boolean) {
    if (this.nativeInput.checked !== isChecked) {
      // keep the checked value and native input `nync
      this.nativeInput.checked = isChecked;
    }
    if (this.didLoad && isChecked) {
      // only emit ionSelect when checked is true
      this.ionSelect.emit({
        checked: isChecked,
        value: this.value
       });
    }
    this.emitStyle();
  }

  @PropDidChange('disabled')
  disabledChanged(isDisabled: boolean) {
    this.nativeInput.disabled = isDisabled;
    this.emitStyle();
  }

  emitStyle() {
    clearTimeout(this.styleTmr);

    this.styleTmr = setTimeout(() => {
      this.ionStyle.emit({
        ...createThemedClasses(this.mode, this.color, 'radio'),
        'radio-checked': this.checked,
        'radio-disabled': this.disabled
      });
    });
  }

  onChange() {
    this.checked = true;
    this.nativeInput.focus();
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
    const hostAttrs: any = {
      'class': {
        'radio-checked': this.checked,
        'radio-disabled': this.disabled,
        'radio-key': this.keyFocus
      }
    };

    return hostAttrs;
  }

  render() {
    const radioClasses: CssClassMap = {
      'radio-icon': true,
      'radio-checked': this.checked
    };
    return [
      <div class={radioClasses}>
        <div class='radio-inner'/>
      </div>,
      <input
        type='radio'
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


export interface HTMLIonRadioElementEvent extends CustomEvent {
  target: HTMLIonRadioElement;
}

let radioButtonIds = 0;
