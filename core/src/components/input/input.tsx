import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Build, Component, Element, Event, Host, Method, Prop, State, Watch, forceUpdate, h } from '@stencil/core';
import type { NotchController } from '@utils/forms';
import { createNotchController } from '@utils/forms';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes, debounceEvent, inheritAttributes, componentOnReady } from '@utils/helpers';
import { createSlotMutationController } from '@utils/slot-mutation-controller';
import type { SlotMutationController } from '@utils/slot-mutation-controller';
import { createColorClasses, hostContext } from '@utils/theme';
import { closeCircle, closeSharp, eyeOff, eye } from 'ionicons/icons';

import { getIonMode } from '../../global/ionic-global';
import type { AutocompleteTypes, Color, StyleEventDetail, TextFieldTypes } from '../../interface';

import type { InputChangeEventDetail, InputInputEventDetail } from './input-interface';
import { getCounterText } from './input.utils';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot label - The label text to associate with the input. Use the `labelPlacement` property to control where the label is placed relative to the input. Use this if you need to render a label with custom HTML. (EXPERIMENTAL)
 * @slot start - Content to display at the leading edge of the input. (EXPERIMENTAL)
 * @slot end - Content to display at the trailing edge of the input. (EXPERIMENTAL)
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
  private slotMutationController?: SlotMutationController;
  private notchController?: NotchController;
  private notchSpacerEl: HTMLElement | undefined;

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
  private focusedValue?: string | number | null;

  @State() hasFocus = false;

  @Element() el!: HTMLIonInputElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

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
   * Sets the [`autofocus` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus) on the native input element.
   *
   * This may not be sufficient for the element to be focused on page load. See [managing focus](/docs/developing/managing-focus) for more information.
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
   *
   * See https://ionicframework.com/docs/troubleshooting/runtime#accessing-this
   * if you need to access `this` from within the callback.
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
   * Set the icon that can be used to represent hiding a password. Defaults to `eyeOff`.
   */
  @Prop() hidePasswordIcon?: string;

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
   * Set the icon that can be used to represent showing a password. Defaults to `eye`.
   */
  @Prop() showPasswordIcon?: string;

  /**
   * If `true`, a password toggle icon will appear in the input.
   * Clicking the icon toggles the input type between `"text"` and `"password"`, allowing the user to view or hide the input value.
   */
  @Prop() showPasswordToggle = false;

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
   * The type of control to display. The default type is text.
   */
  @Prop({ mutable: true }) type: TextFieldTypes = 'text';

  /**
   * The value of the input.
   */
  @Prop({ mutable: true }) value?: string | number | null = '';

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
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
      ...inheritAttributes(this.el, ['tabindex', 'title', 'data-form-type']),
    };
  }

  connectedCallback() {
    const { el } = this;

    this.slotMutationController = createSlotMutationController(el, ['label', 'start', 'end'], () => forceUpdate(this));
    this.notchController = createNotchController(
      el,
      () => this.notchSpacerEl,
      () => this.labelSlot
    );

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
   *
   * See [managing focus](/docs/developing/managing-focus) for more information.
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
  async getInputElement(): Promise<HTMLInputElement> {
    /**
     * If this gets called in certain early lifecycle hooks (ex: Vue onMounted),
     * nativeInput won't be defined yet with the custom elements build, so wait for it to load in.
     */
    if (!this.nativeInput) {
      await new Promise((resolve) => componentOnReady(this.el, resolve));
    }
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

  private getValue(): string {
    return typeof this.value === 'number' ? this.value.toString() : (this.value || '').toString();
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
     * The following keys do not modify the
     * contents of the input. As a result, pressing
     * them should not edit the input.
     *
     * We can't check to see if the value of the input
     * was changed because we call checkClearOnEdit
     * in a keydown listener, and the key has not yet
     * been added to the input.
     */
    const IGNORED_KEYS = ['Enter', 'Tab', 'Shift', 'Meta', 'Alt', 'Control'];
    const pressedIgnoredKey = IGNORED_KEYS.includes(ev.key);

    /**
     * Clear the input if the control has not been previously cleared during focus.
     * Do not clear if the user hitting enter to submit a form.
     */
    if (!this.didInputClearOnEdit && this.hasValue() && !pressedIgnoredKey) {
      this.value = '';
      this.emitInputChange(ev);
    }

    /**
     * Pressing an IGNORED_KEYS first and
     * then an allowed key will cause the input to not
     * be cleared.
     */
    if (!pressedIgnoredKey) {
      this.didInputClearOnEdit = true;
    }
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

  private togglePasswordVisibility = () => {
    this.type = this.type === 'text' ? 'password' : 'text';
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

  render() {
    const { disabled, fill, readonly, shape, inputId, labelPlacement, el, hasFocus, type } = this;
    const mode = getIonMode(this);
    const value = this.getValue();
    const inItem = hostContext('ion-item', this.el);
    const shouldRenderHighlight = mode === 'md' && fill !== 'outline' && !inItem;
    const showPasswordIcon = this.showPasswordIcon || eye;
    const hidePasswordIcon = this.hidePasswordIcon || eyeOff;

    const hasValue = this.hasValue();
    const hasStartEndSlots = el.querySelector('[slot="start"], [slot="end"]') !== null;

    /**
     * If the label is stacked, it should always sit above the input.
     * For floating labels, the label should move above the input if
     * the input has a value, is focused, or has anything in either
     * the start or end slot.
     *
     * If there is content in the start slot, the label would overlap
     * it if not forced to float. This is also applied to the end slot
     * because with the default or solid fills, the input is not
     * vertically centered in the container, but the label is. This
     * causes the slots and label to appear vertically offset from each
     * other when the label isn't floating above the input. This doesn't
     * apply to the outline fill, but this was not accounted for to keep
     * things consistent.
     *
     * TODO(FW-5592): Remove hasStartEndSlots condition
     */
    const labelShouldFloat =
      labelPlacement === 'stacked' || (labelPlacement === 'floating' && (hasValue || hasFocus || hasStartEndSlots));
    return (
      <Host
        class={createColorClasses(this.color, {
          [mode]: true,
          'has-value': hasValue,
          'has-focus': hasFocus,
          'label-floating': labelShouldFloat,
          [`input-fill-${fill}`]: fill !== undefined,
          [`input-shape-${shape}`]: shape !== undefined,
          [`input-label-placement-${labelPlacement}`]: true,
          'in-item': inItem,
          'in-item-color': hostContext('ion-item.ion-color', this.el),
          'input-disabled': disabled,
        })}
      >
        {/**
         * htmlFor is needed so that clicking the label always focuses
         * the input. Otherwise, if the start slot has something
         * interactable, clicking the label would focus that instead
         * since it comes before the input in the DOM.
         */}
        <label class="input-wrapper" htmlFor={inputId}>
          {this.renderLabelContainer()}
          <div class="native-wrapper">
            <slot name="start"></slot>
            <input
              class="native-input"
              ref={(input) => (this.nativeInput = input)}
              id={inputId}
              disabled={disabled}
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
              type={type}
              value={value}
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
            {this.showPasswordToggle && !readonly && !disabled && (
              <button
                aria-label="show password"
                aria-checked={type === 'text' ? 'true' : 'false'}
                aria-controls={inputId}
                role="switch"
                type="button"
                class="input-password-toggle"
                onPointerDown={(ev) => {
                  /**
                   * This prevents mobile browsers from
                   * blurring the input when the password toggle
                   * button is activated.
                   */
                  ev.preventDefault();
                }}
                onClick={this.togglePasswordVisibility}
              >
                <ion-icon
                  aria-hidden="true"
                  icon={type === 'text' ? hidePasswordIcon : showPasswordIcon}
                ></ion-icon>
              </button>
            )}
            <slot name="end"></slot>
          </div>
          {shouldRenderHighlight && <div class="input-highlight"></div>}
        </label>
        {this.renderBottomContent()}
      </Host>
    );
  }
}

let inputIds = 0;
