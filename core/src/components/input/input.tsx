import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Build, Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import type {
  AutocompleteTypes,
  Color,
  InputChangeEventDetail,
  InputInputEventDetail,
  StyleEventDetail,
  TextFieldTypes,
} from '../../interface';
import type { Attributes } from '../../utils/helpers';
import { inheritAriaAttributes, debounceEvent, findItemLabel, inheritAttributes } from '../../utils/helpers';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-input',
  styleUrls: {
    ios: 'input.ios.scss',
    md: 'input.md.scss',
  },
  scoped: true,
})
export class Input implements ComponentInterface {
  private nativeInput?: HTMLInputElement;
  private inputId = `ion-input-${inputIds++}`;
  private inheritedAttributes: Attributes = {};
  private isComposing = false;
  /**
   * `true` if the input was cleared as a result of the user typing
   * with `clearOnEdit` enabled.
   *
   * Resets when the input loses focus.
   */
  private didInputClearOnEdit = false;
  /**
   * The value of the input when the input is focused.
   */
  private focusedValue?: string | number | null;

  @State() hasFocus = false;

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * This attribute is ignored.
   * @deprecated
   */
  @Prop() accept?: string;

  /**
   * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
   * Available options: `"off"`, `"none"`, `"on"`, `"sentences"`, `"words"`, `"characters"`.
   */
  @Prop() autocapitalize = 'off';

  /**
   * Indicates whether the value of the control can be automatically completed by the browser.
   */
  @Prop() autocomplete: AutocompleteTypes = 'off';

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
  @Prop() clearOnEdit?: boolean;

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke.
   */
  @Prop() debounce = 0;

  @Watch('debounce')
  protected debounceChanged() {
    this.ionInput = debounceEvent(this.ionInput, this.debounce);
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
   * A hint to the browser for which enter key to display.
   * Possible values: `"enter"`, `"done"`, `"go"`, `"next"`,
   * `"previous"`, `"search"`, and `"send"`.
   */
  @Prop() enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';

  /**
   * A hint to the browser for which keyboard to display.
   * Possible values: `"none"`, `"text"`, `"tel"`, `"url"`,
   * `"email"`, `"numeric"`, `"decimal"`, and `"search"`.
   */
  @Prop() inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

  /**
   * The maximum value, which must not be less than its minimum (min attribute) value.
   */
  @Prop() max?: string | number;

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.
   */
  @Prop() maxlength?: number;

  /**
   * The minimum value, which must not be greater than its maximum (max attribute) value.
   */
  @Prop() min?: string | number;

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.
   */
  @Prop() minlength?: number;

  /**
   * If `true`, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"`, otherwise it is ignored.
   */
  @Prop() multiple?: boolean;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, `"date"`, or `"password"`, otherwise it is ignored. When the type attribute is `"date"`, `pattern` will only be used in browsers that do not support the `"date"` input type natively. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date for more information.
   */
  @Prop() pattern?: string;

  /**
   * Instructional text that shows before the input has a value.
   * This property applies only when the `type` property is set to `"email"`,
   * `"number"`, `"password"`, `"search"`, `"tel"`, `"text"`, or `"url"`, otherwise it is ignored.
   */
  @Prop() placeholder?: string;

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
  @Prop({ mutable: true }) value?: string | number | null = '';

  /**
   * The `ionInput` event fires when the `value` of an `<ion-input>` element
   * has been changed.
   *
   * For elements that accept text input (`type=text`, `type=tel`, etc.), the interface
   * is [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent); for others,
   * the interface is [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). If
   * the input is cleared on edit, the type is `null`.
   */
  @Event() ionInput!: EventEmitter<InputInputEventDetail>;

  /**
   * The `ionChange` event is fired for `<ion-input>` elements when the user
   * modifies the element's value. Unlike the `ionInput` event, the `ionChange`
   * event is not necessarily fired for each alteration to an element's value.
   *
   * Depending on the way the users interacts with the element, the `ionChange`
   * event fires at a different moment:
   * - When the user commits the change explicitly (e.g. by selecting a date
   * from a date picker for `<ion-input type="date">`, etc.).
   * - When the element loses focus after its value has changed: for elements
   * where the user's interaction is typing.
   *
   */
  @Event() ionChange!: EventEmitter<InputChangeEventDetail>;

  /**
   * Emitted when the input loses focus.
   */
  @Event() ionBlur!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the input has focus.
   */
  @Event() ionFocus!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  /**
   * Update the item classes when the placeholder changes
   */
  @Watch('placeholder')
  protected placeholderChanged() {
    this.emitStyle();
  }

  /**
   * Update the native input element when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    const nativeInput = this.nativeInput;
    const value = this.getValue();
    if (nativeInput && nativeInput.value !== value && !this.isComposing) {
      /**
       * Assigning the native input's value on attribute
       * value change, allows `ionInput` implementations
       * to override the control's value.
       *
       * Used for patterns such as input trimming (removing whitespace),
       * or input masking.
       */
      nativeInput.value = value;
    }
    this.emitStyle();
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
      ...inheritAttributes(this.el, ['tabindex', 'title', 'data-form-type']),
    };
  }

  connectedCallback() {
    this.emitStyle();
    this.debounceChanged();
    if (Build.isBrowser) {
      document.dispatchEvent(
        new CustomEvent('ionInputDidLoad', {
          detail: this.el,
        })
      );
    }
  }

  componentDidLoad() {
    const nativeInput = this.nativeInput;
    if (nativeInput) {
      // TODO: FW-729 Update to JSX bindings when Stencil resolves bug with:
      // https://github.com/ionic-team/stencil/issues/3235
      nativeInput.addEventListener('compositionstart', this.onCompositionStart);
      nativeInput.addEventListener('compositionend', this.onCompositionEnd);
    }
  }

  disconnectedCallback() {
    if (Build.isBrowser) {
      document.dispatchEvent(
        new CustomEvent('ionInputDidUnload', {
          detail: this.el,
        })
      );
    }
    const nativeInput = this.nativeInput;
    if (nativeInput) {
      nativeInput.removeEventListener('compositionstart', this.onCompositionStart);
      nativeInput.removeEventListener('compositionEnd', this.onCompositionEnd);
    }
  }

  /**
   * Sets focus on the native `input` in `ion-input`. Use this method instead of the global
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

  /**
   * Emits an `ionChange` event.
   *
   * This API should be called for user committed changes.
   * This API should not be used for external value changes.
   */
  private emitValueChange(event?: Event) {
    const { value } = this;
    // Checks for both null and undefined values
    const newValue = value == null ? value : value.toString();
    // Emitting a value change should update the internal state for tracking the focused value
    this.focusedValue = newValue;
    this.ionChange.emit({ value: newValue, event });
  }

  /**
   * Emits an `ionInput` event.
   */
  private emitInputChange(event?: Event) {
    const { value } = this;
    this.ionInput.emit({ value, event });
  }

  private shouldClearOnEdit() {
    const { type, clearOnEdit } = this;
    return clearOnEdit === undefined ? type === 'password' : clearOnEdit;
  }

  private getValue(): string {
    return typeof this.value === 'number' ? this.value.toString() : (this.value || '').toString();
  }

  private emitStyle() {
    this.ionStyle.emit({
      interactive: true,
      input: true,
      'has-placeholder': this.placeholder !== undefined,
      'has-value': this.hasValue(),
      'has-focus': this.hasFocus,
      'interactive-disabled': this.disabled,
    });
  }

  private onInput = (ev: InputEvent | Event) => {
    const input = ev.target as HTMLInputElement | null;
    if (input) {
      this.value = input.value || '';
    }
    this.emitInputChange(ev);
  };

  private onChange = (ev: Event) => {
    this.emitValueChange(ev);
  };

  private onBlur = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.emitStyle();

    if (this.focusedValue !== this.value) {
      /**
       * Emits the `ionChange` event when the input value
       * is different than the value when the input was focused.
       */
      this.emitValueChange(ev);
    }

    this.didInputClearOnEdit = false;

    this.ionBlur.emit(ev);
  };

  private onFocus = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.focusedValue = this.value;
    this.emitStyle();

    this.ionFocus.emit(ev);
  };

  private onKeydown = (ev: KeyboardEvent) => {
    this.checkClearOnEdit(ev);
  };

  private checkClearOnEdit(ev: KeyboardEvent) {
    if (!this.shouldClearOnEdit()) {
      return;
    }
    /**
     * Clear the input if the control has not been previously cleared during focus.
     * Do not clear if the user hitting enter to submit a form.
     */
    if (!this.didInputClearOnEdit && this.hasValue() && ev.key !== 'Enter') {
      this.value = '';
      this.emitInputChange(ev);
    }
    this.didInputClearOnEdit = true;
  }

  private onCompositionStart = () => {
    this.isComposing = true;
  };

  private onCompositionEnd = () => {
    this.isComposing = false;
  };

  private onClearButtonClick = (ev?: Event) => {
    if (this.clearInput && !this.readonly && !this.disabled && ev) {
      ev.preventDefault();
      ev.stopPropagation();
      // Attempt to focus input again after pressing clear button
      this.setFocus();
    }
    this.value = '';
    this.emitInputChange(ev);
  };

  private hasValue(): boolean {
    return this.getValue().length > 0;
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
        class={createColorClasses(this.color, {
          [mode]: true,
          'has-value': this.hasValue(),
          'has-focus': this.hasFocus,
        })}
      >
        <input
          class="native-input"
          ref={(input) => (this.nativeInput = input)}
          aria-labelledby={label ? labelId : null}
          disabled={this.disabled}
          accept={this.accept}
          autoCapitalize={this.autocapitalize}
          autoComplete={this.autocomplete}
          autoCorrect={this.autocorrect}
          autoFocus={this.autofocus}
          enterKeyHint={this.enterkeyhint}
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
          spellcheck={this.spellcheck}
          step={this.step}
          size={this.size}
          type={this.type}
          value={value}
          onInput={this.onInput}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onKeyDown={this.onKeydown}
          {...this.inheritedAttributes}
        />
        {this.clearInput && !this.readonly && !this.disabled && (
          <button
            aria-label="reset"
            type="button"
            class="input-clear-icon"
            onPointerDown={(ev) => {
              /**
               * This prevents mobile browsers from
               * blurring the input when the clear
               * button is activated.
               */
              ev.preventDefault();
            }}
            onClick={this.onClearButtonClick}
          />
        )}
      </Host>
    );
  }
}

let inputIds = 0;
