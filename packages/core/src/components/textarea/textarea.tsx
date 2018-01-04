import { Component, Element, Event, EventEmitter, Prop, PropDidChange } from '@stencil/core';

import { debounce } from '../../utils/helpers';
import { createThemedClasses } from '../../utils/theme';
import { TextareaComponent } from '../input/input-base';


@Component({
  tag: 'ion-textarea',

  // TODO: separate textarea from input scss
  // right now we're cheating by knowing ion-input
  // css is bundled with ion-textarea

  // styleUrls: {
  //   ios: 'input.ios.scss',
  //   md: 'input.md.scss'
  // },

  host: {
    theme: 'input'
  }
})
export class Textarea implements TextareaComponent {
  mode: string;
  color: string;

  didBlurAfterEdit: boolean;
  styleTmr: number;

  @Element() private el: HTMLElement;

  /**
   * @output {Event} Emitted when the input value has changed.
   */
  @Event() ionInput: EventEmitter;

  /**
   * @output {Event} Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter;

  /**
   * @output {Event} Emitted when the input loses focus.
   */
  @Event() ionBlur: EventEmitter;

  /**
   * @output {Event} Emitted when the input has focus.
   */
  @Event() ionFocus: EventEmitter;

  /**
   * @input {string} Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.
   */
  @Prop() autocapitalize: string = 'none';

  /**
   * @input {string} Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.
   */
  @Prop() autocomplete: string = 'off';

  /**
   * @input {string} This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.
   */
  @Prop() autofocus: boolean = false;

  /**
   * @input {boolean} If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @Prop({ mutable: true }) clearOnEdit: boolean;

  /**
   * @input {number} Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
   */
  @Prop() debounce: number = 250;
  @PropDidChange('debounce')
  private debounceInput() {
    this.ionInput.emit = debounce(
      this.ionInput.emit.bind(this.ionInput),
      this.debounce
    );
  }

  /**
   * @input {boolean} If true, the user cannot interact with the textarea. Defaults to `false`.
   */
  @Prop() disabled: boolean = false;

  @PropDidChange('disabled')
  protected disabledChanged() {
    this.emitStyle();
  }

  /**
   * @input {number} If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.
   */
  @Prop() maxlength: number;

  /**
   * @input {number} If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.
   */
  @Prop() minlength: number;

  /**
   * @input {string} The name of the control, which is submitted with the form data.
   */
  @Prop() name: string;

  /**
   * @input {string} Instructional text that shows before the input has a value.
   */
  @Prop() placeholder: string;

  /**
   * @input {boolean} If true, the user cannot modify the value. Defaults to `false`.
   */
  @Prop() readonly: boolean = false;

  /**
   * @input {boolean} If true, the user must fill in a value before submitting a form.
   */
  @Prop() required: boolean = false;

  /**
   * @input {string} If true, the element will have its spelling and grammar checked. Defaults to `false`.
   */
  @Prop() spellcheck: boolean = false;

  /**
   * @input {number} The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.
   */
  @Prop() cols: number;

  /**
   * @input {number} The number of visible text lines for the control.
   */
  @Prop() rows: number;

  /**
   * @input {string} Indicates how the control wraps text. Possible values are: `"hard"`, `"soft"`, `"off"`.
   */
  @Prop() wrap: string;

  /**
   * @input {string} The value of the textarea.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * Update the native input element when the value changes
   */
  @PropDidChange('value')
  protected valueChanged() {
    const inputEl = this.el.querySelector('textarea');
    if (inputEl.value !== this.value) {
      inputEl.value = this.value;
    }
  }

  componentDidLoad() {
    this.debounceInput();
    this.emitStyle();
  }

  private emitStyle() {
    clearTimeout(this.styleTmr);

    let styles = {
      'textarea': true,
      'input': true,
      'input-disabled': this.disabled,
      'input-has-value': this.hasValue(),
      'input-has-focus': this.hasFocus()
    };

    this.styleTmr = setTimeout(() => {
      this.ionStyle.emit(styles);
    });
  }

  clearTextInput(ev: any) {
    this.value = '';
    this.ionInput.emit(ev);
  }

  inputBlurred(ev: any) {
    this.ionBlur.emit(ev);

    this.focusChange(this.hasFocus());
    this.emitStyle();
  }

  inputChanged(ev: any) {
    this.value = ev.target && ev.target.value;
    this.ionInput.emit(ev);
    this.emitStyle();
  }

  inputFocused(ev: any) {
    this.ionFocus.emit(ev);

    this.focusChange(this.hasFocus());
    this.emitStyle();
  }

  inputKeydown(ev: any) {
    this.checkClearOnEdit(ev);
  }

  /**
  * Check if we need to clear the text input if clearOnEdit is enabled
  */
  checkClearOnEdit(ev: any) {
    if (!this.clearOnEdit) {
      return;
    }

    // Did the input value change after it was blurred and edited?
    if (this.didBlurAfterEdit && this.hasValue()) {
      // Clear the input
      this.clearTextInput(ev);
    }

    // Reset the flag
    this.didBlurAfterEdit = false;
  }

  focusChange(inputHasFocus: boolean) {
    // If clearOnEdit is enabled and the input blurred but has a value, set a flag
    if (this.clearOnEdit && !inputHasFocus && this.hasValue()) {
      this.didBlurAfterEdit = true;
    }
  }

  hasFocus(): boolean {
    // check if an input has focus or not
    return this.el && (this.el.querySelector(':focus') === this.el.querySelector('textarea'));
  }

  hasValue(): boolean {
    return (this.value !== null && this.value !== undefined && this.value !== '');
  }

  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'text-input');
    // TODO aria-labelledby={this.item.labelId}

    return (
      <textarea
        autoCapitalize={this.autocapitalize}
        // autoComplete={this.autocomplete}
        autoFocus={this.autofocus}
        disabled={this.disabled}
        maxLength={this.maxlength}
        minLength={this.minlength}
        name={this.name}
        placeholder={this.placeholder}
        readOnly={this.readonly}
        required={this.required}
        spellCheck={this.spellcheck}
        cols={this.cols}
        rows={this.rows}
        wrap={this.wrap}
        class={themedClasses}
        onBlur={this.inputBlurred.bind(this)}
        onInput={this.inputChanged.bind(this)}
        onFocus={this.inputFocused.bind(this)}
        onKeyDown={this.inputKeydown.bind(this)}
      >
        {this.value}
      </textarea>
    );
  }
}
