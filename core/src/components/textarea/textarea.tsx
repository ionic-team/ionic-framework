import type { ComponentInterface, EventEmitter } from '@stencil/core';
import {
  Build,
  Component,
  Element,
  Event,
  Host,
  Method,
  Prop,
  State,
  Watch,
  forceUpdate,
  h,
  writeTask,
} from '@stencil/core';
import type { LegacyFormController, NotchController } from '@utils/forms';
import { createLegacyFormController, createNotchController } from '@utils/forms';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes, debounceEvent, findItemLabel, inheritAttributes } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';
import { createSlotMutationController } from '@utils/slot-mutation-controller';
import type { SlotMutationController } from '@utils/slot-mutation-controller';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color, StyleEventDetail } from '../../interface';
import { getCounterText } from '../input/input.utils';

import type { TextareaChangeEventDetail, TextareaInputEventDetail } from './textarea-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot label - The label text to associate with the textarea. Use the `labelPlacement` property to control where the label is placed relative to the textarea. Use this if you need to render a label with custom HTML. (EXPERIMENTAL)
 * @slot start - Content to display at the leading edge of the textarea. (EXPERIMENTAL)
 * @slot end - Content to display at the trailing edge of the textarea. (EXPERIMENTAL)
 */
@Component({
  tag: 'ion-textarea',
  styleUrls: {
    ios: 'textarea.ios.scss',
    md: 'textarea.md.scss',
  },
  scoped: true,
})
export class Textarea implements ComponentInterface {
  private nativeInput?: HTMLTextAreaElement;
  private inputId = `ion-textarea-${textareaIds++}`;
  /**
   * `true` if the textarea was cleared as a result of the user typing
   * with `clearOnEdit` enabled.
   *
   * Resets when the textarea loses focus.
   */
  private didTextareaClearOnEdit = false;
  private textareaWrapper?: HTMLElement;
  private inheritedAttributes: Attributes = {};
  private originalIonInput?: EventEmitter<TextareaInputEventDetail>;
  private legacyFormController!: LegacyFormController;
  private notchSpacerEl: HTMLElement | undefined;

  private slotMutationController?: SlotMutationController;

  private notchController?: NotchController;

  // This flag ensures we log the deprecation warning at most once.
  private hasLoggedDeprecationWarning = false;

  /**
   * The value of the textarea when the textarea is focused.
   */
  private focusedValue?: string | null;

  @Element() el!: HTMLIonTextareaElement;

  @State() hasFocus = false;

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
  @Prop() autocapitalize = 'none';

  /**
   * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
   */
  @Prop() autofocus = false;

  /**
   * If `true`, the value will be cleared after focus upon edit.
   */
  @Prop() clearOnEdit = false;

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
   * If `true`, the user cannot interact with the textarea.
   */
  @Prop() disabled = false;

  @Watch('disabled')
  protected disabledChanged() {
    this.emitStyle();
  }

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
   * A hint to the browser for which enter key to display.
   * Possible values: `"enter"`, `"done"`, `"go"`, `"next"`,
   * `"previous"`, `"search"`, and `"send"`.
   */
  @Prop() enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';

  /**
   * This attribute specifies the maximum number of characters that the user can enter.
   */
  @Prop() maxlength?: number;

  /**
   * This attribute specifies the minimum number of characters that the user can enter.
   */
  @Prop() minlength?: number;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * Instructional text that shows before the input has a value.
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
   * The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.
   */
  @Prop({ reflect: true }) cols?: number;

  /**
   * The number of visible text lines for the control.
   */
  @Prop() rows?: number;

  /**
   * Indicates how the control wraps text.
   */
  @Prop() wrap?: 'hard' | 'soft' | 'off';

  /**
   * If `true`, the textarea container will grow and shrink based
   * on the contents of the textarea.
   */
  @Prop({ reflect: true }) autoGrow = false;

  /**
   * The value of the textarea.
   */
  @Prop({ mutable: true }) value?: string | null = '';

  /**
   * If `true`, a character counter will display the ratio of characters used and the total character limit.
   * Developers must also set the `maxlength` property for the counter to be calculated correctly.
   */
  @Prop() counter = false;

  /**
   * A callback used to format the counter text.
   * By default the counter text is set to "itemLength / maxLength".
   */
  @Prop() counterFormatter?: (inputLength: number, maxLength: number) => string;

  /**
   * Text that is placed under the textarea and displayed when an error is detected.
   */
  @Prop() errorText?: string;

  /**
   * Text that is placed under the textarea and displayed when no error is detected.
   */
  @Prop() helperText?: string;

  /**
   * The visible label associated with the textarea.
   *
   * Use this if you need to render a plaintext label.
   *
   * The `label` property will take priority over the `label` slot if both are used.
   */
  @Prop() label?: string;

  /**
   * Where to place the label relative to the textarea.
   * `"start"`: The label will appear to the left of the textarea in LTR and to the right in RTL.
   * `"end"`: The label will appear to the right of the textarea in LTR and to the left in RTL.
   * `"floating"`: The label will appear smaller and above the textarea when the textarea is focused or it has a value. Otherwise it will appear on top of the textarea.
   * `"stacked"`: The label will appear smaller and above the textarea regardless even when the textarea is blurred or has no value.
   * `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("...").
   */
  @Prop() labelPlacement: 'start' | 'end' | 'floating' | 'stacked' | 'fixed' = 'start';

  /**
   * Set the `legacy` property to `true` to forcibly use the legacy form control markup.
   * Ionic will only opt components in to the modern form markup when they are
   * using either the `aria-label` attribute or the default slot that contains
   * the label text. As a result, the `legacy` property should only be used as
   * an escape hatch when you want to avoid this automatic opt-in behavior.
   * Note that this property will be removed in an upcoming major release
   * of Ionic, and all form components will be opted-in to using the modern form markup.
   */
  @Prop() legacy?: boolean;

  /**
   * The shape of the textarea. If "round" it will have an increased border radius.
   */
  @Prop() shape?: 'round';

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
  }

  /**
   * The `ionChange` event is fired when the user modifies the textarea's value.
   * Unlike the `ionInput` event, the `ionChange` event is fired when
   * the element loses focus after its value has been modified.
   */
  @Event() ionChange!: EventEmitter<TextareaChangeEventDetail>;

  /**
   * The `ionInput` event is fired each time the user modifies the textarea's value.
   * Unlike the `ionChange` event, the `ionInput` event is fired for each alteration
   * to the textarea's value. This typically happens for each keystroke as the user types.
   *
   * When `clearOnEdit` is enabled, the `ionInput` event will be fired when
   * the user clears the textarea by performing a keydown event.
   */
  @Event() ionInput!: EventEmitter<TextareaInputEventDetail>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  /**
   * Emitted when the input loses focus.
   */
  @Event() ionBlur!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the input has focus.
   */
  @Event() ionFocus!: EventEmitter<FocusEvent>;

  connectedCallback() {
    const { el } = this;
    this.legacyFormController = createLegacyFormController(el);
    this.slotMutationController = createSlotMutationController(el, ['label', 'start', 'end'], () => forceUpdate(this));
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
          detail: el,
        })
      );
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

    if (this.slotMutationController) {
      this.slotMutationController.destroy();
      this.slotMutationController = undefined;
    }

    if (this.notchController) {
      this.notchController.destroy();
      this.notchController = undefined;
    }
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
      ...inheritAttributes(this.el, ['data-form-type', 'title', 'tabindex']),
    };
  }

  componentDidLoad() {
    this.originalIonInput = this.ionInput;
    this.runAutoGrow();
  }

  componentDidRender() {
    this.notchController?.calculateNotchWidth();
  }

  /**
   * Sets focus on the native `textarea` in `ion-textarea`. Use this method instead of the global
   * `textarea.focus()`.
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
    if (this.legacyFormController.hasLegacyControl()) {
      this.ionStyle.emit({
        interactive: true,
        textarea: true,
        input: true,
        'interactive-disabled': this.disabled,
        'has-placeholder': this.placeholder !== undefined,
        'has-value': this.hasValue(),
        'has-focus': this.hasFocus,
        // TODO(FW-2876): remove this
        legacy: !!this.legacy,
      });
    }
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

  private runAutoGrow() {
    if (this.nativeInput && this.autoGrow) {
      writeTask(() => {
        if (this.textareaWrapper) {
          // Replicated value is an attribute to be used in the stylesheet
          // to set the inner contents of a pseudo element.
          this.textareaWrapper.dataset.replicatedValue = this.value ?? '';
        }
      });
    }
  }

  /**
   * Check if we need to clear the text input if clearOnEdit is enabled
   */
  private checkClearOnEdit(ev: KeyboardEvent) {
    if (!this.clearOnEdit) {
      return;
    }
    /**
     * Clear the textarea if the control has not been previously cleared
     * during focus.
     */
    if (!this.didTextareaClearOnEdit && this.hasValue() && ev.key !== 'Tab') {
      this.value = '';
      this.emitInputChange(ev);
    }
    this.didTextareaClearOnEdit = true;
  }

  private focusChange() {
    this.emitStyle();
  }

  private hasValue(): boolean {
    return this.getValue() !== '';
  }

  private getValue(): string {
    return this.value || '';
  }

  // `Event` type is used instead of `InputEvent`
  // since the types from Stencil are not derived
  // from the element (e.g. textarea and input
  // should be InputEvent, but all other elements
  // should be Event).
  private onInput = (ev: Event) => {
    const input = ev.target as HTMLTextAreaElement | null;
    if (input) {
      this.value = input.value || '';
    }
    this.emitInputChange(ev);
  };

  private onChange = (ev: Event) => {
    this.emitValueChange(ev);
  };

  private onFocus = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.focusedValue = this.value;
    this.focusChange();

    this.ionFocus.emit(ev);
  };

  private onBlur = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.focusChange();

    if (this.focusedValue !== this.value) {
      /**
       * Emits the `ionChange` event when the textarea value
       * is different than the value when the textarea was focused.
       */
      this.emitValueChange(ev);
    }
    this.didTextareaClearOnEdit = false;
    this.ionBlur.emit(ev);
  };

  private onKeyDown = (ev: KeyboardEvent) => {
    this.checkClearOnEdit(ev);
  };

  // TODO: FW-2876 - Remove this render function
  private renderLegacyTextarea() {
    if (!this.hasLoggedDeprecationWarning) {
      printIonWarning(
        `ion-textarea now requires providing a label with either the "label" property or the "aria-label" attribute. To migrate, remove any usage of "ion-label" and pass the label text to either the "label" property or the "aria-label" attribute.

Example: <ion-textarea label="Comments"></ion-textarea>
Example with aria-label: <ion-textarea aria-label="Comments"></ion-textarea>

For textareas that do not render the label immediately next to the input, developers may continue to use "ion-label" but must manually associate the label with the textarea by using "aria-labelledby".

Developers can use the "legacy" property to continue using the legacy form markup. This property will be removed in an upcoming major release of Ionic where this form control will use the modern form markup.`,
        this.el
      );
      this.hasLoggedDeprecationWarning = true;
    }

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
          'legacy-textarea': true,
        })}
      >
        <div class="textarea-legacy-wrapper" ref={(el) => (this.textareaWrapper = el)}>
          <textarea
            class="native-textarea"
            aria-labelledby={label ? label.id : null}
            ref={(el) => (this.nativeInput = el)}
            autoCapitalize={this.autocapitalize}
            autoFocus={this.autofocus}
            enterKeyHint={this.enterkeyhint}
            inputMode={this.inputmode}
            disabled={this.disabled}
            maxLength={this.maxlength}
            minLength={this.minlength}
            name={this.name}
            placeholder={this.placeholder || ''}
            readOnly={this.readonly}
            required={this.required}
            spellcheck={this.spellcheck}
            cols={this.cols}
            rows={this.rows}
            wrap={this.wrap}
            onInput={this.onInput}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onKeyDown={this.onKeyDown}
            {...this.inheritedAttributes}
          >
            {value}
          </textarea>
        </div>
      </Host>
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
   * Renders the border container when fill="outline".
   */
  private renderLabelContainer() {
    const mode = getIonMode(this);
    const hasOutlineFill = mode === 'md' && this.fill === 'outline';

    if (hasOutlineFill) {
      /**
       * The outline fill has a special outline
       * that appears around the textarea and the label.
       * Certain stacked and floating label placements cause the
       * label to translate up and create a "cut out"
       * inside of that border by using the notch-spacer element.
       */
      return [
        <div class="textarea-outline-container">
          <div class="textarea-outline-start"></div>
          <div
            class={{
              'textarea-outline-notch': true,
              'textarea-outline-notch-hidden': !this.hasLabel,
            }}
          >
            <div class="notch-spacer" aria-hidden="true" ref={(el) => (this.notchSpacerEl = el)}>
              {this.label}
            </div>
          </div>
          <div class="textarea-outline-end"></div>
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
      <div class="textarea-bottom">
        {this.renderHintText()}
        {this.renderCounter()}
      </div>
    );
  }

  private renderTextarea() {
    const { inputId, disabled, fill, shape, labelPlacement, el, hasFocus } = this;
    const mode = getIonMode(this);
    const value = this.getValue();
    const inItem = hostContext('ion-item', this.el);
    const shouldRenderHighlight = mode === 'md' && fill !== 'outline' && !inItem;

    const hasValue =  this.hasValue();
    const hasStartEndSlots = el.querySelector('[slot="start"], [slot="end"]') !== null;

    /**
     * If the label is stacked, it should always sit above the textarea.
     * For floating labels, the label should move above the textarea if
     * the textarea has a value, is focused, or has anything in either
     * the start or end slot.
     *
     * If there is content in the start slot, the label would overlap
     * it if not forced to float. This is also applied to the end slot
     * because with the default or solid fills, the textarea is not
     * vertically centered in the container, but the label is. This
     * causes the slots and label to appear vertically offset from each
     * other when the label isn't floating above the input. This doesn't
     * apply to the outline fill, but this was not accounted for to keep
     * things consistent.
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
          [`textarea-fill-${fill}`]: fill !== undefined,
          [`textarea-shape-${shape}`]: shape !== undefined,
          [`textarea-label-placement-${labelPlacement}`]: true,
          'textarea-disabled': disabled,
        })}
      >
        {/**
         * htmlFor is needed so that clicking the label always focuses
         * the textarea. Otherwise, if the start slot has something
         * interactable, clicking the label would focus that instead
         * since it comes before the textarea in the DOM.
         */}
        <label class="textarea-wrapper" htmlFor={inputId}>
          {this.renderLabelContainer()}
          <div class="textarea-wrapper-inner">
            <slot name="start"></slot>
            <div class="native-wrapper" ref={(el) => (this.textareaWrapper = el)}>
              <textarea
                class="native-textarea"
                ref={(el) => (this.nativeInput = el)}
                id={inputId}
                disabled={disabled}
                autoCapitalize={this.autocapitalize}
                autoFocus={this.autofocus}
                enterKeyHint={this.enterkeyhint}
                inputMode={this.inputmode}
                minLength={this.minlength}
                maxLength={this.maxlength}
                name={this.name}
                placeholder={this.placeholder || ''}
                readOnly={this.readonly}
                required={this.required}
                spellcheck={this.spellcheck}
                cols={this.cols}
                rows={this.rows}
                wrap={this.wrap}
                onInput={this.onInput}
                onChange={this.onChange}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                onKeyDown={this.onKeyDown}
                {...this.inheritedAttributes}
              >
                {value}
              </textarea>
            </div>
            <slot name="end"></slot>
          </div>
          {shouldRenderHighlight && <div class="textarea-highlight"></div>}
        </label>
        {this.renderBottomContent()}
      </Host>
    );
  }

  render() {
    const { legacyFormController } = this;

    return legacyFormController.hasLegacyControl() ? this.renderLegacyTextarea() : this.renderTextarea();
  }
}

let textareaIds = 0;
