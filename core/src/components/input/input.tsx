import { Component, ComponentInterface, Element, Event, EventEmitter, Method, Prop, State, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, InputChangeEventDetail, StyleEventDetail, TextFieldTypes } from '../../interface';
import { debounceEvent, findItemLabel } from '../../utils/helpers';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-input',
  styleUrls: {
    ios: 'input.ios.scss',
    md: 'input.md.scss'
  },
  scoped: true
})
export class Input implements ComponentInterface {

  private nativeInput?: HTMLInputElement;
  private inputId = `ion-input-${inputIds++}`;
  private didBlurAfterEdit = false;

  @State() hasFocus = false;

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * If the value of the type attribute is `"file"`, then this attribute will indicate the types of files that the server accepts, otherwise it will be ignored. The value must be a comma-separated list of unique content type specifiers.
   */
  @Prop() accept?: string;

  /**
   * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
   */
  @Prop() autocapitalize = 'off';

  /**
   * Indicates whether the value of the control can be automatically completed by the browser.
   */
  @Prop() autocomplete: 'on' | 'off' = 'off';

  /**
   * Whether auto correction should be enabled when the user is entering/editing the text value.
   */
  @Prop() autocorrect: 'on' | 'off' = 'off';

  /**
   * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
   */
  @Prop() autofocus = false;

  /**
   * If `true`, a clear icon will appear in the input when there is a value. Clicking it clears the input.
   */
  @Prop() clearInput = false;

  /**
   * If `true`, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @Prop({ mutable: true }) clearOnEdit?: boolean;

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke.
   */
  @Prop() debounce = 0;

  @Watch('debounce')
  protected debounceChanged() {
    this.ionChange = debounceEvent(this.ionChange, this.debounce);
  }

  /**
   * If `true`, the user cannot interact with the input.
   */
  @Prop() disabled = false;

  @Watch('disabled')
  protected disabledChanged() {
    this.emitStyle();
  }

  /**
   * A hint to the browser for which keyboard to display.
   * This attribute applies when the value of the type attribute is `"text"`, `"password"`, `"email"`, or `"url"`. Possible values are: `"verbatim"`, `"latin"`, `"latin-name"`, `"latin-prose"`, `"full-width-latin"`, `"kana"`, `"katakana"`, `"numeric"`, `"tel"`, `"email"`, `"url"`.
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
   * If `true`, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"` or `"file"`, otherwise it is ignored.
   */
  @Prop() multiple?: boolean;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.
   */
  @Prop() pattern?: string;

  /**
   * Instructional text that shows before the input has a value.
   */
  @Prop() placeholder?: string | null;

  /**
   * If `true`, the user cannot modify the value.
   */
  @Prop() readonly = false;

  /**
   * If `true`, the user must fill in a value before submitting a form.
   */
  @Prop() required = false;

  /**
   * If `true`, the element will have its spelling and grammar checked.
   */
  @Prop() spellcheck = false;

  /**
   * Works with the min and max attributes to limit the increments at which a value can be set.
   * Possible values are: `"any"` or a positive floating point number.
   */
  @Prop() step?: string;

  /**
   * The initial size of the control. This value is in pixels unless the value of the type attribute is `"text"` or `"password"`, in which case it is an integer number of characters. This attribute applies only when the `type` attribute is set to `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.
   */
  @Prop() size?: number;

  /**
   * The type of control to display. The default type is text.
   */
  @Prop() type: TextFieldTypes = 'text';

  /**
   * The value of the input.
   */
  @Prop({ mutable: true }) value?: string | null = '';

  /**
   * Update the native input element when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    this.emitStyle();
    this.ionChange.emit({ value: this.value });
  }

  /**
   * Emitted when a keyboard input ocurred.
   */
  @Event() ionInput!: EventEmitter<KeyboardEvent>;

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange!: EventEmitter<InputChangeEventDetail>;

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
   * @internal
   */
  @Event() ionInputDidLoad!: EventEmitter<void>;

  /**
   * Emitted when the input has been removed.
   * @internal
   */
  @Event() ionInputDidUnload!: EventEmitter<void>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  componentWillLoad() {
    // By default, password inputs clear after focus when they have content
    if (this.clearOnEdit === undefined && this.type === 'password') {
      this.clearOnEdit = true;
    }
    this.emitStyle();
  }

  componentDidLoad() {
    this.debounceChanged();

    this.ionInputDidLoad.emit();
  }

  componentDidUnload() {
    this.ionInputDidUnload.emit();
  }

  /**
   * Sets focus on the specified `ion-input`. Use this method instead of the global
   * `input.focus()`.
   */
  @Method()
  async setFocus() {
    if (this.nativeInput) {
      this.nativeInput.focus();
    }
  }

  /**
   * Returns the native `<input>` element used under the hood.
   */
  @Method()
  getInputElement(): Promise<HTMLInputElement> {
    return Promise.resolve(this.nativeInput!);
  }

  private getValue(): string {
    return this.value || '';
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive': true,
      'input': true,
      'has-placeholder': this.placeholder != null,
      'has-value': this.hasValue(),
      'has-focus': this.hasFocus,
      'interactive-disabled': this.disabled,
    });
  }

  private onInput = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    if (input) {
      this.value = input.value || '';
    }
    this.ionInput.emit(ev as KeyboardEvent);
  }

  private onBlur = () => {
    this.hasFocus = false;
    this.focusChanged();
    this.emitStyle();

    this.ionBlur.emit();
  }

  private onFocus = () => {
    this.hasFocus = true;
    this.focusChanged();
    this.emitStyle();

    this.ionFocus.emit();
  }

  private onKeydown = () => {
    if (this.clearOnEdit) {
      // Did the input value change after it was blurred and edited?
      if (this.didBlurAfterEdit && this.hasValue()) {
        // Clear the input
        this.clearTextInput();
      }

      // Reset the flag
      this.didBlurAfterEdit = false;
    }
  }

  private clearTextInput = (ev?: Event) => {
    if (this.clearInput && !this.readonly && !this.disabled && ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    this.value = '';

    /**
     * This is needed for clearOnEdit
     * Otherwise the value will not be cleared
     * if user is inside the input
     */
    if (this.nativeInput) {
      this.nativeInput.value = '';
    }
  }

  private focusChanged() {
    // If clearOnEdit is enabled and the input blurred but has a value, set a flag
    if (this.clearOnEdit && !this.hasFocus && this.hasValue()) {
      this.didBlurAfterEdit = true;
    }
  }

  private hasValue(): boolean {
    return this.getValue().length > 0;
  }

  hostData() {
    const mode = getIonMode(this);
    return {
      'aria-disabled': this.disabled ? 'true' : null,
      class: {
        ...createColorClasses(this.color),
        [mode]: true,
        'has-value': this.hasValue(),
        'has-focus': this.hasFocus
      }
    };
  }

  render() {
    const value = this.getValue();
    const labelId = this.inputId + '-lbl';
    const label = findItemLabel(this.el);
    if (label) {
      label.id = labelId;
    }

    return [
      <input
        class="native-input"
        ref={input => this.nativeInput = input}
        aria-labelledby={labelId}
        disabled={this.disabled}
        accept={this.accept}
        autoCapitalize={this.autocapitalize}
        autoComplete={this.autocomplete}
        autoCorrect={this.autocorrect}
        autoFocus={this.autofocus}
        inputMode={this.inputmode}
        min={this.min}
        max={this.max}
        minLength={this.minlength}
        maxLength={this.maxlength}
        multiple={this.multiple}
        name={this.name}
        pattern={this.pattern}
        placeholder={this.placeholder || ''}
        readOnly={this.readonly}
        required={this.required}
        spellCheck={this.spellcheck}
        step={this.step}
        size={this.size}
        type={this.type}
        value={value}
        onInput={this.onInput}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onKeyDown={this.onKeydown}
      />,
      (this.clearInput && !this.readonly && !this.disabled) && <button
        type="button"
        class="input-clear-icon"
        tabindex="-1"
        onTouchStart={this.clearTextInput}
        onMouseDown={this.clearTextInput}
      />
    ];
  }
}

let inputIds = 0;
