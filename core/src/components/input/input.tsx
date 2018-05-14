import { Component, Element, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { Color, InputChangeEvent, Mode, StyleEvent  } from '../../interface';
import { debounceEvent, deferEvent } from '../../utils/helpers';
import { createThemedClasses } from '../../utils/theme';
import { InputComponent } from './input-base';


@Component({
  tag: 'ion-input',
  styleUrls: {
    ios: 'input.ios.scss',
    md: 'input.md.scss'
  },
  host: {
    theme: 'input'
  }
})
export class Input implements InputComponent {

  private nativeInput: HTMLInputElement|undefined;
  didBlurAfterEdit = false;

  mode!: Mode;
  color?: Color;

  @Element() el!: HTMLElement;

  /**
   * Emitted when a keyboard input ocurred.
   */
  @Event() ionInput!: EventEmitter<KeyboardEvent>;

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange!: EventEmitter<InputChangeEvent>;

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle!: EventEmitter<StyleEvent>;

  /**
   * Emitted when the input loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * Emitted when the input has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the input has been created.
   */
  @Event() ionInputDidLoad!: EventEmitter<void>;

  /**
   * Emitted when the input has been removed.
   */
  @Event() ionInputDidUnload!: EventEmitter<void>;

  /**
   * If the value of the type attribute is `"file"`, then this attribute will indicate the types of files that the server accepts, otherwise it will be ignored. The value must be a comma-separated list of unique content type specifiers.
   */
  @Prop() accept?: string;

  /**
   * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.
   */
  @Prop() autocapitalize = 'none';

  /**
   * Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.
   */
  @Prop() autocomplete = 'off';

  /**
   * Whether autocorrection should be enabled when the user is entering/editing the text value. Defaults to `"off"`.
   */
  @Prop() autocorrect = 'off';

  /**
   * This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.
   */
  @Prop() autofocus = false;

  /**
   * If true, a clear icon will appear in the input when there is a value. Clicking it clears the input. Defaults to `false`.
   */
  @Prop() clearInput = false;

  /**
   * If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @Prop({ mutable: true }) clearOnEdit!: boolean;

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `0`.
   */
  @Prop() debounce = 0;

  @Watch('debounce')
  protected debounceChanged() {
    this.ionChange = debounceEvent(this.ionChange, this.debounce);
  }

  /**
   * If true, the user cannot interact with the input. Defaults to `false`.
   */
  @Prop() disabled = false;

  @Watch('disabled')
  protected disabledChanged() {
    this.emitStyle();
  }

  /**
   * A hint to the browser for which keyboard to display. This attribute applies when the value of the type attribute is `"text"`, `"password"`, `"email"`, or `"url"`. Possible values are: `"verbatim"`, `"latin"`, `"latin-name"`, `"latin-prose"`, `"full-width-latin"`, `"kana"`, `"katakana"`, `"numeric"`, `"tel"`, `"email"`, `"url"`.
   */
  @Prop() inputmode?: string;

  /**
   * The maximum value, which must not be less than its minimum (min attribute) value.
   */
  @Prop() max?: string;

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.
   */
  @Prop() maxlength?: number;

  /**
   * The minimum value, which must not be greater than its maximum (max attribute) value.
   */
  @Prop() min?: string;

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.
   */
  @Prop() minlength?: number;

  /**
   * If true, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"` or `"file"`, otherwise it is ignored.
   */
  @Prop() multiple?: boolean;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name?: string;

  /**
   * A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.
   */
  @Prop() pattern?: string;

  /**
   * Instructional text that shows before the input has a value.
   */
  @Prop() placeholder?: string;

  /**
   * If true, the user cannot modify the value. Defaults to `false`.
   */
  @Prop() readonly = false;

  /**
   * If true, the user must fill in a value before submitting a form.
   */
  @Prop() required = false;

  /**
   * This is a nonstandard attribute supported by Safari that only applies when the type is `"search"`. Its value should be a nonnegative decimal integer.
   */
  @Prop() results?: number;

  /**
   * If true, the element will have its spelling and grammar checked. Defaults to `false`.
   */
  @Prop() spellcheck = false;

  /**
   * Works with the min and max attributes to limit the increments at which a value can be set. Possible values are: `"any"` or a positive floating point number.
   */
  @Prop() step?: string;

  /**
   * The initial size of the control. This value is in pixels unless the value of the type attribute is `"text"` or `"password"`, in which case it is an integer number of characters. This attribute applies only when the `type` attribute is set to `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.
   */
  @Prop() size?: number;

  /**
   * The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
   */
  @Prop() type = 'text';

  /**
   * The value of the input.
   */
  @Prop({ mutable: true }) value = '';


  /**
   * Update the native input element when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    const inputEl = this.nativeInput;
    const value = this.value;
    if (inputEl && inputEl.value !== value) {
      inputEl.value = value;
    }
    this.emitStyle();
    this.ionChange.emit({value});
  }

  componentWillLoad() {
    // By default, password inputs clear after focus when they have content
    if (this.clearOnEdit === undefined && this.type === 'password') {
      this.clearOnEdit = true;
    }
  }

  componentDidLoad() {
    this.ionStyle = deferEvent(this.ionStyle);
    this.debounceChanged();
    this.emitStyle();

    this.ionInputDidLoad.emit();
  }

  componentDidUnload() {
    this.nativeInput = undefined;
    this.ionInputDidUnload.emit();
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive': true,
      'input': true,
      'input-disabled': this.disabled,
      'input-has-value': this.hasValue(),
      'input-has-focus': this.hasFocus()
    });
  }

  private onInput(ev: KeyboardEvent) {
    const input = ev.target as HTMLInputElement;
    if (input) {
      this.value = ev.target && (ev.target as HTMLInputElement).value || '';
    }
    this.ionInput.emit(ev);
  }

  private onBlur() {
    this.focusChanged();
    this.emitStyle();

    this.ionBlur.emit();
  }

  private onFocus() {
    this.focusChanged();
    this.emitStyle();

    this.ionFocus.emit();
  }

  private focusChanged() {
    // If clearOnEdit is enabled and the input blurred but has a value, set a flag
    if (this.clearOnEdit && !this.hasFocus() && this.hasValue()) {
      this.didBlurAfterEdit = true;
    }
  }

  private inputKeydown() {
    this.checkClearOnEdit();
  }

  /**
   * Check if we need to clear the text input if clearOnEdit is enabled
   */
  private checkClearOnEdit() {
    if (!this.clearOnEdit) {
      return;
    }

    // Did the input value change after it was blurred and edited?
    if (this.didBlurAfterEdit && this.hasValue()) {
      // Clear the input
      this.clearTextInput();
    }

    // Reset the flag
    this.didBlurAfterEdit = false;
  }

  private clearTextInput() {
    this.value = '';
  }

  private hasFocus(): boolean {
    // check if an input has focus or not
    return this.nativeInput === document.activeElement;
  }

  private hasValue(): boolean {
    return (this.value !== '');
  }

  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'native-input');
    // TODO aria-labelledby={this.item.labelId}

    return [
      <input
        ref={input => this.nativeInput = input as any}
        aria-disabled={this.disabled ? 'true' : false}
        accept={this.accept}
        autoCapitalize={this.autocapitalize}
        autoComplete={this.autocomplete}
        autoCorrect={this.autocorrect}
        autoFocus={this.autofocus}
        class={themedClasses}
        disabled={this.disabled}
        inputMode={this.inputmode}
        min={this.min}
        max={this.max}
        minLength={this.minlength}
        maxLength={this.maxlength}
        multiple={this.multiple}
        name={this.name}
        pattern={this.pattern}
        placeholder={this.placeholder}
        results={this.results}
        readOnly={this.readonly}
        required={this.required}
        spellCheck={this.spellcheck}
        step={this.step}
        size={this.size}
        type={this.type}
        value={this.value}
        onInput={this.onInput.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onKeyDown={this.inputKeydown.bind(this)}
      />,
      <button
        type="button"
        class="input-clear-icon"
        hidden={!this.clearInput}
        onClick={this.clearTextInput.bind(this)}
        onMouseDown={this.clearTextInput.bind(this)}/>
    ];
  }
}
