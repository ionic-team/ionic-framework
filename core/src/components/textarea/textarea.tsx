import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h, readTask } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, StyleEventDetail, TextareaChangeEventDetail } from '../../interface';
import { debounceEvent, findItemLabel } from '../../utils/helpers';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-textarea',
  styleUrls: {
    ios: 'textarea.ios.scss',
    md: 'textarea.md.scss'
  },
  scoped: true
})
export class Textarea implements ComponentInterface {

  private nativeInput?: HTMLTextAreaElement;
  private inputId = `ion-input-${textareaIds++}`;
  private didBlurAfterEdit = false;

  @Element() el!: HTMLElement;

  @State() hasFocus = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
   */
  @Prop() autocapitalize = 'none';

  /**
   * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
   */
  @Prop() autofocus = false;

  /**
   * If `true`, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @Prop({ mutable: true }) clearOnEdit = false;

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke.
   */
  @Prop() debounce = 0;

  @Watch('debounce')
  protected debounceChanged() {
    this.ionChange = debounceEvent(this.ionChange, this.debounce);
  }

  /**
   * If `true`, the user cannot interact with the textarea.
   */
  @Prop() disabled = false;

  @Watch('disabled')
  protected disabledChanged() {
    this.emitStyle();
  }

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.
   */
  @Prop() maxlength?: number;

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.
   */
  @Prop() minlength?: number;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

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
   * The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.
   */
  @Prop() cols?: number;

  /**
   * The number of visible text lines for the control.
   */
  @Prop() rows?: number;

  /**
   * Indicates how the control wraps text.
   */
  @Prop() wrap?: 'hard' | 'soft' | 'off';

  /**
   * If `true`, the element height will increase based on the value.
   */
  @Prop() autoGrow = false;

  /**
   * The value of the textarea.
   */
  @Prop({ mutable: true }) value?: string | null = '';

  /**
   * Update the native input element when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    const nativeInput = this.nativeInput;
    const value = this.getValue();
    if (nativeInput && nativeInput.value !== value) {
      nativeInput.value = value;
    }
    this.runAutoGrow();
    this.emitStyle();
    this.ionChange.emit({ value });
  }

  /**
   * Emitted when the input value has changed.
   */
  @Event() ionChange!: EventEmitter<TextareaChangeEventDetail>;

  /**
   * Emitted when a keyboard input ocurred.
   */
  @Event() ionInput!: EventEmitter<KeyboardEvent>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

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

  componentWillLoad() {
    this.emitStyle();
  }

  componentDidLoad() {
    this.debounceChanged();

    this.runAutoGrow();

    this.ionInputDidLoad.emit();
  }

  private runAutoGrow() {
    const nativeInput = this.nativeInput;
    if (nativeInput && this.autoGrow) {
      readTask(() => {
        nativeInput.style.height = nativeInput.scrollHeight + 'px';
      });
    }
  }

  componentDidUnload() {
    this.ionInputDidUnload.emit();
  }

  /**
   * Sets focus on the specified `ion-textarea`. Use this method instead of the global
   * `input.focus()`.
   */
  @Method()
  async setFocus() {
    if (this.nativeInput) {
      this.nativeInput.focus();
    }
  }

  /**
   * Returns the native `<textarea>` element used under the hood.
   */
  @Method()
  getInputElement(): Promise<HTMLTextAreaElement> {
    return Promise.resolve(this.nativeInput!);
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive': true,
      'textarea': true,
      'input': true,
      'interactive-disabled': this.disabled,
      'has-placeholder': this.placeholder != null,
      'has-value': this.hasValue(),
      'has-focus': this.hasFocus
    });
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
      this.value = '';
    }

    // Reset the flag
    this.didBlurAfterEdit = false;
  }

  private focusChange() {
    // If clearOnEdit is enabled and the input blurred but has a value, set a flag
    if (this.clearOnEdit && !this.hasFocus && this.hasValue()) {
      this.didBlurAfterEdit = true;
    }
    this.emitStyle();
  }

  private hasValue(): boolean {
    return this.getValue() !== '';
  }

  private getValue(): string {
    return this.value || '';
  }

  private onInput = (ev: Event) => {
    if (this.nativeInput) {
      this.value = this.nativeInput.value;
    }
    this.emitStyle();
    this.ionInput.emit(ev as KeyboardEvent);
  }

  private onFocus = () => {
    this.hasFocus = true;
    this.focusChange();

    this.ionFocus.emit();
  }

  private onBlur = () => {
    this.hasFocus = false;
    this.focusChange();

    this.ionBlur.emit();
  }

  private onKeyDown = () => {
    this.checkClearOnEdit();
  }

  render() {
    const mode = getIonMode(this);
    const value = this.getValue();
    const labelId = this.inputId + '-lbl';
    const label = findItemLabel(this.el);
    if (label) {
      label.id = labelId;
    }

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        class={{
          ...createColorClasses(this.color),
          [mode]: true,
        }}
      >
        <textarea
          class="native-textarea"
          ref={el => this.nativeInput = el}
          autoCapitalize={this.autocapitalize}
          autoFocus={this.autofocus}
          disabled={this.disabled}
          maxLength={this.maxlength}
          minLength={this.minlength}
          name={this.name}
          placeholder={this.placeholder || ''}
          readOnly={this.readonly}
          required={this.required}
          spellCheck={this.spellcheck}
          cols={this.cols}
          rows={this.rows}
          wrap={this.wrap}
          onInput={this.onInput}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDown}
        >
          {value}
        </textarea>
      </Host>
    );
  }
}

let textareaIds = 0;
