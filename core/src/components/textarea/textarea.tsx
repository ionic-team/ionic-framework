import type { ComponentInterface, EventEmitter } from '@stencil/core';
import {
  AttachInternals,
  Build,
  Component,
  Element,
  Event,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch,
  forceUpdate,
  h,
  writeTask,
} from '@stencil/core';
import type { NotchController, StartContainerController } from '@utils/forms';
import {
  createNotchController,
  createStartContainerController,
  checkInvalidState,
  reportValidityToElementInternals,
} from '@utils/forms';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes, debounceEvent, inheritAttributes, componentOnReady } from '@utils/helpers';
import { createSlotMutationController } from '@utils/slot-mutation-controller';
import type { SlotMutationController } from '@utils/slot-mutation-controller';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonMode, getIonTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';
import { getCounterText } from '../input/input.utils';

import type { TextareaChangeEventDetail, TextareaInputEventDetail } from './textarea-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot label - The label text to associate with the textarea. Use the `labelPlacement` property to control where the label is placed relative to the textarea. Use this if you need to render a label with custom HTML. (EXPERIMENTAL)
 * @slot start - Content to display at the leading edge of the textarea. (EXPERIMENTAL)
 * @slot end - Content to display at the trailing edge of the textarea. (EXPERIMENTAL)
 *
 * @part wrapper - The clickable label element that wraps the entire form field (label text, slots, and native textarea).
 * @part container - The inner wrapper element that directly contains the native textarea element.
 * @part label - The label text describing the textarea.
 * @part native - The native textarea element.
 * @part supporting-text - Supporting text displayed beneath the textarea label.
 * @part helper-text - Supporting text displayed beneath the textarea label when the textarea is valid.
 * @part error-text - Supporting text displayed beneath the textarea label when the textarea is invalid and touched.
 * @part counter - The character counter displayed when the counter property is set.
 * @part bottom - The container element for helper text, error text, and counter.
 */
@Component({
  tag: 'ion-textarea',
  styleUrls: {
    ios: 'textarea.ios.scss',
    md: 'textarea.md.scss',
    ionic: 'textarea.ionic.scss',
  },
  shadow: {
    delegatesFocus: true,
  },
  formAssociated: true,
})
export class Textarea implements ComponentInterface {
  private nativeInput?: HTMLTextAreaElement;
  private inputId = `ion-textarea-${textareaIds++}`;
  private helperTextId = `${this.inputId}-helper-text`;
  private errorTextId = `${this.inputId}-error-text`;
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

  private slotMutationController?: SlotMutationController;

  private notchController?: NotchController;
  private notchSpacerEl: HTMLElement | undefined;
  private startContainerController?: StartContainerController;
  private startContainerEl: HTMLElement | undefined;

  /**
   * The value of the textarea when the textarea is focused.
   */
  private focusedValue?: string | null;

  @Element() el!: HTMLIonTextareaElement;

  @AttachInternals() internals!: ElementInternals;

  /**
   * The `hasFocus` state ensures the focus class is
   * added regardless of how the element is focused.
   * The `ion-focused` class only applies when focused
   * via tabbing, not by clicking.
   * The `has-focus` logic was added to ensure the class
   * is applied in both cases.
   */
  @State() hasFocus = false;

  /**
   * Track validation state for proper aria-live announcements
   */
  @State() isInvalid = false;

  private validationObserver?: MutationObserver;

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
   * Sets the [`autofocus` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus) on the native input element.
   *
   * This may not be sufficient for the element to be focused on page load. See [managing focus](/docs/developing/managing-focus) for more information.
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
  @Prop({ reflect: true }) disabled = false;

  /**
   * Update element internals when disabled prop changes
   */
  @Watch('disabled')
  protected disabledChanged() {
    this.updateElementInternals();
  }

  /**
   * The fill for the item. If `"solid"` the item will have a background. If
   * `"outline"` the item will be transparent with a border. Only available when the theme is `"md"`.
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
  @Prop({ reflect: true }) readonly = false;

  /**
   * If `true`, the user must fill in a value before submitting a form.
   */
  @Prop({ reflect: true }) required = false;

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
   *
   * See https://ionicframework.com/docs/troubleshooting/runtime#accessing-this
   * if you need to access `this` from within the callback.
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
   * Set to `"soft"` for a textarea with slightly rounded corners,
   * `"round"` for a textarea with fully rounded corners, or `"rectangular"`
   * for a textarea without rounded corners.
   *
   * Defaults to `"round"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() shape?: 'soft' | 'round' | 'rectangular';

  /**
   * The size of the textarea. If "large" it will increase the height of the textarea, while
   * "small" and "medium" provide progressively smaller heights. The default size is "medium".
   * This property only applies to the `"ionic"` theme.
   */
  @Prop() size?: 'small' | 'medium' | 'large' = 'medium';

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
    this.updateElementInternals();
    this.runAutoGrow();
  }

  /**
   * Update native input and element internals when required prop changes
   */
  @Watch('required')
  protected requiredChanged() {
    // Explicitly update the native element's required attribute to ensure
    // browser validation works correctly when required changes dynamically.
    // While the template binding should handle this, we need to update it
    // synchronously for the browser's validation to recognize the change.
    if (this.nativeInput) {
      this.nativeInput.required = this.required;
    }
    this.updateElementInternals();
  }

  /**
   * dir is a globally enumerated attribute.
   * As a result, creating these as properties
   * can have unintended side effects. Instead, we
   * listen for attribute changes and inherit them
   * to the inner `<textarea>` element.
   */
  @Watch('dir')
  onDirChanged(newValue: string) {
    this.inheritedAttributes = {
      ...this.inheritedAttributes,
      dir: newValue,
    };
    forceUpdate(this);
  }

  /**
   * The `ionChange` event is fired when the user modifies the textarea's value.
   * Unlike the `ionInput` event, the `ionChange` event is fired when
   * the element loses focus after its value has been modified.
   *
   * This event will not emit when programmatically setting the `value` property.
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
   * Emitted when the input loses focus.
   */
  @Event() ionBlur!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the input has focus.
   */
  @Event() ionFocus!: EventEmitter<FocusEvent>;

  /**
   * This prevents the native input from emitting the click event.
   * Instead, the click event from the ion-textarea is emitted.
   */
  @Listen('click', { capture: true })
  onClickCapture(ev: Event) {
    const nativeInput = this.nativeInput;
    if (nativeInput && ev.target === nativeInput) {
      ev.stopPropagation();
      this.el.click();
    }
  }

  connectedCallback() {
    const { el } = this;

    this.slotMutationController = createSlotMutationController(el, ['label', 'start', 'end'], () => {
      this.startContainerController?.calculateStartContainerWidth();

      forceUpdate(this);
    });

    this.notchController = createNotchController(
      el,
      () => this.notchSpacerEl,
      () => this.labelSlot
    );

    this.startContainerController = createStartContainerController(
      el,
      () => this.startContainerEl,
      () => {
        return Build.isBrowser && getIonMode(this) === 'md' && this.fill === 'outline';
      }
    );

    this.startContainerController.calculateStartContainerWidth();

    // Watch for class changes to update validation state
    if (Build.isBrowser && typeof MutationObserver !== 'undefined') {
      this.validationObserver = new MutationObserver(() => {
        const newIsInvalid = checkInvalidState(this.el);
        if (this.isInvalid !== newIsInvalid) {
          this.isInvalid = newIsInvalid;
          // Force a re-render to update aria-describedby immediately
          forceUpdate(this);
        }
      });

      this.validationObserver.observe(el, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    // Always set initial state
    this.isInvalid = checkInvalidState(this.el);

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

    if (this.startContainerController) {
      this.startContainerController.destroy();
      this.startContainerController = undefined;
    }

    // Clean up validation observer to prevent memory leaks
    if (this.validationObserver) {
      this.validationObserver.disconnect();
      this.validationObserver = undefined;
    }
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
      ...inheritAttributes(this.el, ['data-form-type', 'title', 'tabindex', 'dir']),
    };
  }

  componentDidLoad() {
    this.originalIonInput = this.ionInput;
    this.updateElementInternals();
    this.runAutoGrow();

    // Override focus() to delegate to the native textarea.
    // This is needed for Safari and Firefox which don't properly
    // delegate focus when calling focus() directly on the host.
    this.el.focus = () => {
      this.setFocus();
    };
  }

  componentDidRender() {
    this.notchController?.calculateNotchWidth();
    this.startContainerController?.calculateStartContainerWidth();
  }

  /**
   * Sets focus on the native `textarea` in `ion-textarea`. Use this method instead of the global
   * `textarea.focus()`.
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
   * Returns the native `<textarea>` element used under the hood.
   */
  @Method()
  async getInputElement(): Promise<HTMLTextAreaElement> {
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
     * The following keys do not modify the
     * contents of the input. As a result, pressing
     * them should not edit the textarea.
     *
     * We can't check to see if the value of the textarea
     * was changed because we call checkClearOnEdit
     * in a keydown listener, and the key has not yet
     * been added to the textarea.
     *
     * Unlike ion-input, the "Enter" key does modify the
     * textarea by adding a new line, so "Enter" is not
     * included in the IGNORED_KEYS array.
     */
    const IGNORED_KEYS = ['Tab', 'Shift', 'Meta', 'Alt', 'Control'];
    const pressedIgnoredKey = IGNORED_KEYS.includes(ev.key);

    /**
     * Clear the textarea if the control has not been previously cleared
     * during focus.
     */
    if (!this.didTextareaClearOnEdit && this.hasValue() && !pressedIgnoredKey) {
      this.value = '';
      this.emitInputChange(ev);
    }

    /**
     * Pressing an IGNORED_KEYS first and
     * then an allowed key will cause the input to not
     * be cleared.
     */
    if (!pressedIgnoredKey) {
      this.didTextareaClearOnEdit = true;
    }
  }

  private hasValue(): boolean {
    return this.getValue() !== '';
  }

  private getValue(): string {
    return this.value || '';
  }

  /**
   * Called when the form state is restored.
   * Restores the component's value.
   */
  formStateRestoreCallback(value: string) {
    this.value = value;
  }

  /**
   * Called when the form is reset.
   * Resets the component's value.
   */
  formResetCallback() {
    this.value = '';
  }

  /**
   * Updates the form value and reports validity state to the browser via
   * ElementInternals. This should be called when the component loads, when
   * the required prop changes, when the disabled prop changes, and when the value
   * changes to ensure the form value stays in sync and validation state is updated.
   */
  private updateElementInternals() {
    // Disabled form controls should not be included in form data
    // Pass null to setFormValue when disabled to exclude it from form submission
    const value = this.disabled ? null : this.getValue();
    // ElementInternals may not be fully available in test environments
    // so we need to check if the method exists before calling it
    if (typeof this.internals.setFormValue === 'function') {
      this.internals.setFormValue(value);
    }
    reportValidityToElementInternals(this.nativeInput, this.internals);
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

    this.ionFocus.emit(ev);
  };

  private onBlur = (ev: FocusEvent) => {
    this.hasFocus = false;

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

  private renderLabel() {
    const { label } = this;

    return (
      <div
        class={{
          'label-text-wrapper': true,
          'label-text-wrapper-hidden': !this.hasLabel,
        }}
        part="label"
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

  private getFill(): string | undefined {
    const theme = getIonTheme(this);
    const { fill } = this;

    if (theme === 'ionic' && fill === undefined) {
      return 'outline';
    }

    return fill;
  }

  private getShape(): string | undefined {
    const theme = getIonTheme(this);
    const { shape } = this;

    // TODO(ROU-11050): Update theme check when shapes are defined for all themes.
    if (theme === 'ionic' && shape === undefined) {
      return 'round';
    }

    return shape;
  }

  /**
   * Stops propagation for clicks on the textarea's own content (label text,
   * textarea field) to prevent double-click events. Allows clicks on slotted
   * content to propagate so event delegation works for parent handlers.
   *
   * Only slots belonging directly to this textarea should be considered.
   * The textarea itself may have a slot attribute when placed in an item
   * or toolbar, which does not make its content slotted content.
   */
  /**
   * Whether the click that began the current gesture already reached the
   * consumer. Clicking the label makes the browser forward a second click to
   * the native textarea; WebKit forwards it even when the gesture began on
   * slotted content, where it would arrive as a duplicate.
   */
  private clickReachedConsumer = false;

  private onLabelPointerDown = () => {
    this.clickReachedConsumer = false;
  };

  private onLabelClick = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;

    if (target === this.nativeInput) {
      /**
       * Either the click the label forwarded here, or a direct click on the
       * textarea. Both should reach the consumer as a single click on the host,
       * so only drop it when something else already did.
       */
      if (this.clickReachedConsumer) {
        ev.stopPropagation();
      }

      this.clickReachedConsumer = false;

      return;
    }

    /**
     * Clicks on slotted content belong to the consumer and have to keep
     * propagating. Everything else is internal chrome (the label, the
     * start/end containers, the wrapper padding) and is represented by the
     * click the label forwards to the native textarea.
     */
    const slotted = target.closest('[slot="start"], [slot="end"]');
    const isSlotted = slotted !== null && slotted !== this.el && this.el.contains(slotted);

    this.clickReachedConsumer = isSlotted;

    if (!isSlotted) {
      ev.stopPropagation();
    }
  };

  /**
   * Renders the outline border with a notch for the label.
   */
  private renderOutlineContainer() {
    return (
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
      </div>
    );
  }

  /**
   * Renders the helper text or error text values
   */
  private renderHintText() {
    const { helperText, errorText, helperTextId, errorTextId, isInvalid } = this;

    return [
      <div id={helperTextId} class="helper-text" part="supporting-text helper-text" aria-live="polite">
        {!isInvalid ? helperText : null}
      </div>,
      <div id={errorTextId} class="error-text" part="supporting-text error-text" role="alert">
        {isInvalid ? errorText : null}
      </div>,
    ];
  }

  private getHintTextID(): string | undefined {
    const { isInvalid, helperText, errorText, helperTextId, errorTextId } = this;

    if (isInvalid && errorText) {
      return errorTextId;
    }

    if (helperText) {
      return helperTextId;
    }

    return undefined;
  }

  private renderCounter() {
    const { counter, maxlength, counterFormatter, value } = this;
    if (counter !== true || maxlength === undefined) {
      return;
    }

    return (
      <div class="counter" part="counter">
        {getCounterText(value, maxlength, counterFormatter)}
      </div>
    );
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
      <div class="textarea-bottom" part="bottom">
        {this.renderHintText()}
        {this.renderCounter()}
      </div>
    );
  }

  render() {
    const { inputId, disabled, readonly, size, labelPlacement, hasFocus } = this;
    const mode = getIonMode(this);
    const theme = getIonTheme(this);
    const fill = this.getFill();
    const shape = this.getShape();
    const value = this.getValue();
    const inItem = hostContext('ion-item', this.el);
    const shouldRenderHighlight = theme === 'md' && fill !== 'outline' && !inItem;

    const hasValue = this.hasValue();
    const hasOutlineFill = mode === 'md' && fill === 'outline';

    /**
     * If the label is stacked, it should always sit above the textarea.
     * For floating labels, the label should move above the textarea if
     * the textarea has a value or is focused.
     */
    const labelShouldFloat = labelPlacement === 'stacked' || (labelPlacement === 'floating' && (hasValue || hasFocus));

    return (
      <Host
        class={createColorClasses(this.color, {
          [theme]: true,
          'has-value': hasValue,
          'has-focus': hasFocus,
          'label-floating': labelShouldFloat,
          [`textarea-fill-${fill}`]: fill !== undefined,
          [`textarea-shape-${shape}`]: shape !== undefined,
          [`textarea-size-${size}`]: true,
          [`textarea-label-placement-${labelPlacement}`]: true,
          'in-item': inItem,
          'textarea-disabled': disabled,
          'textarea-readonly': readonly,
        })}
      >
        {/**
         * htmlFor is needed so that clicking the label always focuses
         * the textarea. Otherwise, if the start slot has something
         * interactable, clicking the label would focus that instead
         * since it comes before the textarea in the DOM.
         */}
        <label
          class="textarea-wrapper"
          htmlFor={inputId}
          onMouseDown={this.onLabelPointerDown}
          onClick={this.onLabelClick}
          part="wrapper"
        >
          {hasOutlineFill && this.renderOutlineContainer()}
          <div class="textarea-start" ref={(el) => (this.startContainerEl = el)}>
            <slot name="start"></slot>
          </div>
          <div class="textarea-control">
            {this.renderLabel()}
            <div class="native-wrapper" ref={(el) => (this.textareaWrapper = el)} part="container">
              <textarea
                class="native-textarea"
                part="native"
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
                aria-describedby={this.getHintTextID()}
                aria-invalid={this.isInvalid ? 'true' : undefined}
                {...this.inheritedAttributes}
              >
                {value}
              </textarea>
            </div>
          </div>
          <div class="textarea-end">
            <slot name="end"></slot>
          </div>
          {shouldRenderHighlight && <div class="textarea-highlight"></div>}
        </label>
        {this.renderBottomContent()}
      </Host>
    );
  }
}

let textareaIds = 0;
