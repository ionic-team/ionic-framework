import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Build, Component, Element, Event, Host, Method, Prop, State, Watch, forceUpdate, h } from '@stencil/core';
import type { LegacyFormController, NotchController } from '@utils/forms';
import { createLegacyFormController, createNotchController } from '@utils/forms';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes, debounceEvent, findItemLabel, inheritAttributes } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';
import { createSlotMutationController } from '@utils/slot-mutation-controller';
import type { SlotMutationController } from '@utils/slot-mutation-controller';
import { createColorClasses, hostContext } from '@utils/theme';
import { closeCircle, closeSharp } from 'ionicons/icons';

import { getIonMode } from '../../global/ionic-global';
import type { AutocompleteTypes, Color, StyleEventDetail, TextFieldTypes } from '../../interface';

import type { InputChangeEventDetail, InputInputEventDetail, InputValue } from './input-interface';
import { getCounterText } from './input.utils';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot label - The label text to associate with the input. Use the `labelPlacement` property to control where the label is placed relative to the input. Use this if you need to render a label with custom HTML. (EXPERIMENTAL)
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
  private legacyFormController!: LegacyFormController;
  private slotMutationController?: SlotMutationController;
  private notchController?: NotchController;
  private notchSpacerEl: HTMLElement | undefined;

  // This flag ensures we log the deprecation warning at most once.
  private hasLoggedDeprecationWarning = false;
  private originalIonInput?: EventEmitter<InputInputEventDetail>;

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
  private focusedValue?: InputValue;

  @State() hasFocus = false;

  @Element() el!: HTMLIonInputElement;

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
   * If `true`, a character counter will display the ratio of characters used and the total character limit. Developers must also set the `maxlength` property for the counter to be calculated correctly.
   */
  @Prop() counter = false;

  /**
   * A callback used to format the counter text.
   * By default the counter text is set to "itemLength / maxLength".
   */
  @Prop() counterFormatter?: (inputLength: number, maxLength: number) => string;

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke.
   */
  @Prop() debounce?: number;

  @Watch('debounce')
  protected debounceChanged() {
    const { ionInput, debounce, originalIonInput } = this;

    /**
     * If debounce is undefined, we have to manually revert the ionInput emitter in case
     * debounce used to be set to a number. Otherwise, the event would stay debounced.
     */
    this.ionInput = debounce === undefined ? originalIonInput ?? ionInput : debounceEvent(ionInput, debounce);
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
   * Text that is placed under the input and displayed when an error is detected.
   */
  @Prop() errorText?: string;

  /**
   * The fill for the item. If `"solid"` the item will have a background. If
   * `"outline"` the item will be transparent with a border. Only available in `md` mode.
   */
  @Prop() fill?: 'outline' | 'solid';

  /**
   * A hint to the browser for which keyboard to display.
   * Possible values: `"none"`, `"text"`, `"tel"`, `"url"`,
   * `"email"`, `"numeric"`, `"decimal"`, and `"search"`.
   */
  @Prop() inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

  /**
   * Text that is placed under the input and displayed when no error is detected.
   */
  @Prop() helperText?: string;

  /**
   * The visible label associated with the input.
   *
   * Use this if you need to render a plaintext label.
   *
   * The `label` property will take priority over the `label` slot if both are used.
   */
  @Prop() label?: string;

  /**
   * Where to place the label relative to the input.
   * `"start"`: The label will appear to the left of the input in LTR and to the right in RTL.
   * `"end"`: The label will appear to the right of the input in LTR and to the left in RTL.
   * `"floating"`: The label will appear smaller and above the input when the input is focused or it has a value. Otherwise it will appear on top of the input.
   * `"stacked"`: The label will appear smaller and above the input regardless even when the input is blurred or has no value.
   * `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("...").
   */
  @Prop() labelPlacement: 'start' | 'end' | 'floating' | 'stacked' | 'fixed' = 'start';

  /**
   * Set the `legacy` property to `true` to forcibly use the legacy form control markup.
   * Ionic will only opt components in to the modern form markup when they are
   * using either the `aria-label` attribute or the `label` property. As a result,
   * the `legacy` property should only be used as an escape hatch when you want to
   * avoid this automatic opt-in behavior.
   * Note that this property will be removed in an upcoming major release
   * of Ionic, and all form components will be opted-in to using the modern form markup.
   */
  @Prop() legacy?: boolean;

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
   * The shape of the input. If "round" it will have an increased border radius.
   */
  @Prop() shape?: 'round';

  /**
   * If `true`, the element will have its spelling and grammar checked.
   */
  @Prop() spellcheck = false;

  /**
   * Works with the min and max attributes to limit the increments at which a value can be set.
   * Possible values are: `"any"` or a positive floating point number.
   */
  @Prop() step?: string;

  // FW-4914 Remove this property in Ionic 8
  @Prop() size?: number;

  /**
   * The type of control to display. The default type is text.
   */
  @Prop() type: TextFieldTypes = 'text';

  /**
   * The value of the input.
   */
  @Prop({ mutable: true }) value?: InputValue = '';

  @Prop({ mutable: true }) defaultValue?: InputValue = this.getValue();

  /**
   * The `ionInput` event is fired each time the user modifies the input's value.
   * Unlike the `ionChange` event, the `ionInput` event is fired for each alteration
   * to the input's value. This typically happens for each keystroke as the user types.
   *
   * For elements that accept text input (`type=text`, `type=tel`, etc.), the interface
   * is [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent); for others,
   * the interface is [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). If
   * the input is cleared on edit, the type is `null`.
   */
  @Event() ionInput!: EventEmitter<InputInputEventDetail>;

  /**
   * The `ionChange` event is fired when the user modifies the input's value.
   * Unlike the `ionInput` event, the `ionChange` event is only fired when changes
   * are committed, not as the user types.
   *
   * Depending on the way the users interacts with the element, the `ionChange`
   * event fires at a different moment:
   * - When the user commits the change explicitly (e.g. by selecting a date
   * from a date picker for `<ion-input type="date">`, pressing the "Enter" key, etc.).
   * - When the element loses focus after its value has changed: for elements
   * where the user's interaction is typing.
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

  @Watch('defaultValue')
  protected defaultValueChanged(newValue: InputValue) {
    this.value = this.defaultValue = this.getValue(newValue);
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
      ...inheritAttributes(this.el, ['tabindex', 'title', 'data-form-type']),
    };
  }

  connectedCallback() {
    const { el } = this;

    this.legacyFormController = createLegacyFormController(el);
    this.slotMutationController = createSlotMutationController(el, 'label', () => forceUpdate(this));
    this.notchController = createNotchController(
      el,
      () => this.notchSpacerEl,
      () => this.labelSlot
    );

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
    this.originalIonInput = this.ionInput;

    if (this.value === '' || this.value == null) {
      if (this.defaultValue !== '') {
        this.value = this.getValue(this.defaultValue);
      }
    }
  }

  componentDidRender() {
    this.notchController?.calculateNotchWidth();
  }

  disconnectedCallback() {
    if (Build.isBrowser) {
      document.dispatchEvent(
        new CustomEvent('ionInputDidUnload', {
          detail: this.el,
        })
      );
    }

    if (this.slotMutationController) {
      this.slotMutationController.destroy();
      this.slotMutationController = undefined;
    }

    if (this.notchController) {
      this.notchController.destroy();
      this.notchController = undefined;
    }
  }

  /**
   * Sets focus on the native `input` in `ion-input`. Use this method instead of the global
   * `input.focus()`.
   *
   * Developers who wish to focus an input when a page enters
   * should call `setFocus()` in the `ionViewDidEnter()` lifecycle method.
   *
   * Developers who wish to focus an input when an overlay is presented
   * should call `setFocus` after `didPresent` has resolved.
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

    // Checks for both null and undefined values
    const newValue = value == null ? value : value.toString();

    this.ionInput.emit({ value: newValue, event });
  }

  private shouldClearOnEdit() {
    const { type, clearOnEdit } = this;
    return clearOnEdit === undefined ? type === 'password' : clearOnEdit;
  }

  private getValue(value = this.value): string {
    return typeof value === 'number' ? value.toString() : (value || '').toString();
  }

  private emitStyle() {
    if (this.legacyFormController.hasLegacyControl()) {
      this.ionStyle.emit({
        interactive: true,
        input: true,
        'has-placeholder': this.placeholder !== undefined,
        'has-value': this.hasValue(),
        'has-focus': this.hasFocus,
        'interactive-disabled': this.disabled,
      });
    }
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
    if (!this.didInputClearOnEdit && this.hasValue() && ev.key !== 'Enter' && ev.key !== 'Tab') {
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

  private clearTextInput = (ev?: Event) => {
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

  /**
   * Renders the helper text or error text values
   */
  private renderHintText() {
    const { helperText, errorText } = this;

    return [<div class="helper-text">{helperText}</div>, <div class="error-text">{errorText}</div>];
  }

  private renderCounter() {
    const { counter, maxlength, counterFormatter, value } = this;
    if (counter !== true || maxlength === undefined) {
      return;
    }

    return <div class="counter">{getCounterText(value, maxlength, counterFormatter)}</div>;
  }

  /**
   * Responsible for rendering helper text,
   * error text, and counter. This element should only
   * be rendered if hint text is set or counter is enabled.
   */
  private renderBottomContent() {
    const { counter, helperText, errorText, maxlength } = this;

    /**
     * undefined and empty string values should
     * be treated as not having helper/error text.
     */
    const hasHintText = !!helperText || !!errorText;
    const hasCounter = counter === true && maxlength !== undefined;
    if (!hasHintText && !hasCounter) {
      return;
    }

    return (
      <div class="input-bottom">
        {this.renderHintText()}
        {this.renderCounter()}
      </div>
    );
  }

  private renderLabel() {
    const { label } = this;

    return (
      <div
        class={{
          'label-text-wrapper': true,
          'label-text-wrapper-hidden': !this.hasLabel,
        }}
      >
        {label === undefined ? <slot name="label"></slot> : <div class="label-text">{label}</div>}
      </div>
    );
  }

  /**
   * Gets any content passed into the `label` slot,
   * not the <slot> definition.
   */
  private get labelSlot() {
    return this.el.querySelector('[slot="label"]');
  }

  /**
   * Returns `true` if label content is provided
   * either by a prop or a content. If you want
   * to get the plaintext value of the label use
   * the `labelText` getter instead.
   */
  private get hasLabel() {
    return this.label !== undefined || this.labelSlot !== null;
  }

  /**
   * Renders the border container
   * when fill="outline".
   */
  private renderLabelContainer() {
    const mode = getIonMode(this);
    const hasOutlineFill = mode === 'md' && this.fill === 'outline';

    if (hasOutlineFill) {
      /**
       * The outline fill has a special outline
       * that appears around the input and the label.
       * Certain stacked and floating label placements cause the
       * label to translate up and create a "cut out"
       * inside of that border by using the notch-spacer element.
       */
      return [
        <div class="input-outline-container">
          <div class="input-outline-start"></div>
          <div
            class={{
              'input-outline-notch': true,
              'input-outline-notch-hidden': !this.hasLabel,
            }}
          >
            <div class="notch-spacer" aria-hidden="true" ref={(el) => (this.notchSpacerEl = el)}>
              {this.label}
            </div>
          </div>
          <div class="input-outline-end"></div>
        </div>,
        this.renderLabel(),
      ];
    }

    /**
     * If not using the outline style,
     * we can render just the label.
     */
    return this.renderLabel();
  }

  private renderInput() {
    const { disabled, fill, readonly, shape, inputId, labelPlacement } = this;
    const mode = getIonMode(this);
    const value = this.getValue();
    const defaultValue = this.getValue(this.defaultValue);
    const inItem = hostContext('ion-item', this.el);
    const shouldRenderHighlight = mode === 'md' && fill !== 'outline' && !inItem;

    return (
      <Host
        class={createColorClasses(this.color, {
          [mode]: true,
          'has-value': this.hasValue(),
          'has-focus': this.hasFocus,
          [`input-fill-${fill}`]: fill !== undefined,
          [`input-shape-${shape}`]: shape !== undefined,
          [`input-label-placement-${labelPlacement}`]: true,
          'in-item': inItem,
          'in-item-color': hostContext('ion-item.ion-color', this.el),
          'input-disabled': disabled,
        })}
      >
        <label class="input-wrapper">
          {this.renderLabelContainer()}
          <div class="native-wrapper">
            <input
              class="native-input"
              ref={(input) => (this.nativeInput = input)}
              id={inputId}
              disabled={disabled}
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
              readOnly={readonly}
              required={this.required}
              spellcheck={this.spellcheck}
              step={this.step}
              size={this.size}
              type={this.type}
              value={value}
              defaultValue={defaultValue}
              onInput={this.onInput}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onKeyDown={this.onKeydown}
              onCompositionstart={this.onCompositionStart}
              onCompositionend={this.onCompositionEnd}
              {...this.inheritedAttributes}
            />
            {this.clearInput && !readonly && !disabled && (
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
                onClick={this.clearTextInput}
              >
                <ion-icon aria-hidden="true" icon={mode === 'ios' ? closeCircle : closeSharp}></ion-icon>
              </button>
            )}
          </div>
          {shouldRenderHighlight && <div class="input-highlight"></div>}
        </label>
        {this.renderBottomContent()}
      </Host>
    );
  }

  // TODO FW-2764 Remove this
  private renderLegacyInput() {
    if (!this.hasLoggedDeprecationWarning) {
      printIonWarning(
        `ion-input now requires providing a label with either the "label" property or the "aria-label" attribute. To migrate, remove any usage of "ion-label" and pass the label text to either the "label" property or the "aria-label" attribute.

Example: <ion-input label="Email"></ion-input>
Example with aria-label: <ion-input aria-label="Email"></ion-input>

For inputs that do not render the label immediately next to the input, developers may continue to use "ion-label" but must manually associate the label with the input by using "aria-labelledby".

Developers can use the "legacy" property to continue using the legacy form markup. This property will be removed in an upcoming major release of Ionic where this form control will use the modern form markup.`,
        this.el
      );

      if (this.legacy) {
        printIonWarning(
          `ion-input is being used with the "legacy" property enabled which will forcibly enable the legacy form markup. This property will be removed in an upcoming major release of Ionic where this form control will use the modern form markup.

Developers can dismiss this warning by removing their usage of the "legacy" property and using the new input syntax.`,
          this.el
        );
      }

      this.hasLoggedDeprecationWarning = true;
    }

    const mode = getIonMode(this);
    const value = this.getValue();
    const defaultValue = this.getValue(this.defaultValue);
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
          'legacy-input': true,
          'in-item-color': hostContext('ion-item.ion-color', this.el),
        })}
      >
        <input
          class="native-input"
          ref={(input) => (this.nativeInput = input)}
          aria-labelledby={label ? label.id : null}
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
          defaultValue={defaultValue}
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
            onClick={this.clearTextInput}
          >
            <ion-icon aria-hidden="true" icon={mode === 'ios' ? closeCircle : closeSharp}></ion-icon>
          </button>
        )}
      </Host>
    );
  }

  render() {
    const { legacyFormController } = this;

    return legacyFormController.hasLegacyControl() ? this.renderLegacyInput() : this.renderInput();
  }
}

let inputIds = 0;
