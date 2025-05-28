import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Fragment, Host, Prop, State, h, Watch } from '@stencil/core';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';
import { isRTL } from '@utils/rtl';
import { createColorClasses } from '@utils/theme';
import { Method } from 'ionicons/dist/types/stencil-public-runtime';

import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';

import type {
  InputOtpChangeEventDetail,
  InputOtpCompleteEventDetail,
  InputOtpInputEventDetail,
} from './input-otp-interface';

@Component({
  tag: 'ion-input-otp',
  styleUrls: {
    ios: 'input-otp.ios.scss',
    md: 'input-otp.md.scss',
  },
  scoped: true,
})
export class InputOTP implements ComponentInterface {
  private inheritedAttributes: Attributes = {};
  private inputRefs: HTMLInputElement[] = [];
  private inputId = `ion-input-otp-${inputIds++}`;
  private parsedSeparators: number[] = [];

  /**
   * Stores the initial value of the input when it receives focus.
   * Used to determine if the value changed during the focus session
   * to avoid emitting unnecessary change events on blur.
   */
  private focusedValue?: string | number | null;

  /**
   * Tracks whether the user is navigating through input boxes using keyboard navigation
   * (arrow keys, tab) versus mouse clicks. This is used to determine the appropriate
   * focus behavior when an input box is focused.
   */
  private isKeyboardNavigation = false;

  @Element() el!: HTMLIonInputOtpElement;

  @State() private inputValues: string[] = [];
  @State() hasFocus = false;

  /**
   * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
   * Available options: `"off"`, `"none"`, `"on"`, `"sentences"`, `"words"`, `"characters"`.
   */
  @Prop() autocapitalize = 'off';

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * If `true`, the user cannot interact with the input.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The fill for the input boxes. If `"solid"` the input boxes will have a background. If
   * `"outline"` the input boxes will be transparent with a border.
   */
  @Prop() fill?: 'outline' | 'solid' = 'outline';

  /**
   * A hint to the browser for which keyboard to display.
   * Possible values: `"none"`, `"text"`, `"tel"`, `"url"`,
   * `"email"`, `"numeric"`, `"decimal"`, and `"search"`.
   *
   * For numbers (type="number"): "numeric"
   * For text (type="text"): "text"
   */
  @Prop() inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

  /**
   * The number of input boxes to display.
   */
  @Prop() length = 4;

  /**
   * A regex pattern string for allowed characters. Defaults based on type.
   *
   * For numbers (`type="number"`): `"[\p{N}]"`
   * For text (`type="text"`): `"[\p{L}\p{N}]"`
   */
  @Prop() pattern?: string;

  /**
   * If `true`, the user cannot modify the value.
   */
  @Prop({ reflect: true }) readonly = false;

  /**
   * Where separators should be shown between input boxes.
   * Can be a comma-separated string or an array of numbers.
   *
   * For example:
   * `"3"` will show a separator after the 3rd input box.
   * `[1,4]` will show a separator after the 1st and 4th input boxes.
   * `"all"` will show a separator between every input box.
   */
  @Prop() separators?: 'all' | string | number[];

  /**
   * The shape of the input boxes.
   * If "round" they will have an increased border radius.
   * If "rectangular" they will have no border radius.
   * If "soft" they will have a soft border radius.
   */
  @Prop() shape: 'round' | 'rectangular' | 'soft' = 'round';

  /**
   * The size of the input boxes.
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * The type of input allowed in the input boxes.
   */
  @Prop() type: 'text' | 'number' = 'number';

  /**
   * The value of the input group.
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
  @Event() ionInput!: EventEmitter<InputOtpInputEventDetail>;

  /**
   * The `ionChange` event is fired when the user modifies the input's value.
   * Unlike the `ionInput` event, the `ionChange` event is only fired when changes
   * are committed, not as the user types.
   *
   * The `ionChange` event fires when the `<ion-input-otp>` component loses
   * focus after its value has changed.
   *
   * This event will not emit when programmatically setting the `value` property.
   */
  @Event() ionChange!: EventEmitter<InputOtpChangeEventDetail>;

  /**
   * Emitted when all input boxes have been filled with valid values.
   */
  @Event() ionComplete!: EventEmitter<InputOtpCompleteEventDetail>;

  /**
   * Emitted when the input group loses focus.
   */
  @Event() ionBlur!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the input group has focus.
   */
  @Event() ionFocus!: EventEmitter<FocusEvent>;

  /**
   * Resets the value and focus state.
   */
  @Method()
  async reset() {
    this.value = '';

    this.focusedValue = null;
    this.hasFocus = false;

    this.inputRefs.forEach((input) => {
      input.blur();
    });

    this.updateTabIndexes();
  }

  /**
   * Sets focus to an input box.
   * @param index - The index of the input box to focus (0-based).
   * If provided and the input box has a value, the input box at that index will be focused.
   * Otherwise, the first empty input box or the last input if all are filled will be focused.
   */
  @Method()
  async setFocus(index?: number) {
    if (typeof index === 'number') {
      const validIndex = Math.max(0, Math.min(index, this.length - 1));
      this.inputRefs[validIndex]?.focus();
    } else {
      const tabbableIndex = this.getTabbableIndex();
      this.inputRefs[tabbableIndex]?.focus();
    }
  }

  @Watch('value')
  valueChanged() {
    this.initializeValues();
  }

  /**
   * Processes the separators prop into an array of numbers.
   *
   * If the separators prop is not provided, returns an empty array.
   * If the separators prop is 'all', returns an array of all valid positions (1 to length-1).
   * If the separators prop is an array, returns it as is.
   * If the separators prop is a string, splits it by commas and parses each part as a number.
   *
   * If the separators are greater than the input length, it will warn and ignore the separators.
   */
  @Watch('separators')
  @Watch('length')
  private processSeparators() {
    const { separators, length } = this;
    if (separators === undefined) {
      this.parsedSeparators = [];
      return;
    }

    if (typeof separators === 'string' && separators !== 'all') {
      const isValidFormat = /^(\d+)(,\d+)*$/.test(separators);
      if (!isValidFormat) {
        printIonWarning(
          `[ion-input-otp] - Invalid separators format. Expected a comma-separated list of numbers, an array of numbers, or "all". Received: ${separators}`,
          this.el
        );
        this.parsedSeparators = [];
        return;
      }
    }

    let separatorValues: number[];
    if (separators === 'all') {
      separatorValues = Array.from({ length: length - 1 }, (_, i) => i + 1);
    } else if (Array.isArray(separators)) {
      separatorValues = separators;
    } else {
      separatorValues = separators
        .split(',')
        .map((pos) => parseInt(pos, 10))
        .filter((pos) => !isNaN(pos));
    }

    // Check for duplicate separator positions
    const duplicates = separatorValues.filter((pos, index) => separatorValues.indexOf(pos) !== index);
    if (duplicates.length > 0) {
      printIonWarning(
        `[ion-input-otp] - Duplicate separator positions are not allowed. Received: ${separators}`,
        this.el
      );
    }

    const invalidSeparators = separatorValues.filter((pos) => pos > length);
    if (invalidSeparators.length > 0) {
      printIonWarning(
        `[ion-input-otp] - The following separator positions are greater than the input length (${length}): ${invalidSeparators.join(
          ', '
        )}. These separators will be ignored.`,
        this.el
      );
    }

    this.parsedSeparators = separatorValues.filter((pos) => pos <= length);
  }

  componentWillLoad() {
    this.inheritedAttributes = inheritAriaAttributes(this.el);
    this.processSeparators();
    this.initializeValues();
  }

  componentDidLoad() {
    this.updateTabIndexes();
  }

  /**
   * Get the regex pattern for allowed characters.
   * If a pattern is provided, use it to create a regex pattern
   * Otherwise, use the default regex pattern based on type
   */
  private get validKeyPattern(): RegExp {
    return new RegExp(`^${this.getPattern()}$`, 'u');
  }

  /**
   * Gets the string pattern to pass to the input element
   * and use in the regex for allowed characters.
   */
  private getPattern(): string {
    const { pattern, type } = this;
    if (pattern) {
      return pattern;
    }
    return type === 'number' ? '[\\p{N}]' : '[\\p{L}\\p{N}]';
  }

  /**
   * Get the default value for inputmode.
   * If inputmode is provided, use it.
   * Otherwise, use the default inputmode based on type
   */
  private getInputmode(): string {
    const { inputmode } = this;
    if (inputmode) {
      return inputmode;
    }

    if (this.type == 'number') {
      return 'numeric';
    } else {
      return 'text';
    }
  }

  /**
   * Initializes the input values array based on the current value prop.
   * This splits the value into individual characters and validates them against
   * the allowed pattern. The values are then used as the values in the native
   * input boxes and the value of the input group is updated.
   */
  private initializeValues() {
    // Clear all input values
    this.inputValues = Array(this.length).fill('');

    // If the value is null, undefined, or an empty string, return
    if (this.value == null || String(this.value).length === 0) {
      return;
    }

    // Split the value into individual characters and validate
    // them against the allowed pattern
    const chars = String(this.value).split('').slice(0, this.length);
    chars.forEach((char, index) => {
      if (this.validKeyPattern.test(char)) {
        this.inputValues[index] = char;
      }
    });
    // Update the value without emitting events
    this.value = this.inputValues.join('');
  }

  /**
   * Updates the value of the input group.
   * This updates the value of the input group and emits an `ionChange` event.
   * If all of the input boxes are filled, it emits an `ionComplete` event.
   */
  private updateValue(event: Event) {
    const { inputValues, length } = this;
    const newValue = inputValues.join('');
    this.value = newValue;
    this.emitIonInput(event);
    if (newValue.length === length) {
      this.ionComplete.emit({ value: newValue });
    }
    this.updateTabIndexes();
  }

  /**
   * Emits an `ionChange` event.
   * This API should be called for user committed changes.
   * This API should not be used for external value changes.
   */
  private emitIonChange(event: Event) {
    const { value } = this;

    // Checks for both null and undefined values
    const newValue = value == null ? value : value.toString();

    this.ionChange.emit({ value: newValue, event });
  }

  /**
   * Emits an `ionInput` event.
   * This is used to emit the input value when the user types,
   * backspaces, or pastes.
   */
  private emitIonInput(event: Event) {
    const { value } = this;

    // Checks for both null and undefined values
    const newValue = value == null ? value : value.toString();

    this.ionInput.emit({ value: newValue, event });
  }

  /**
   * Handles the focus behavior for the input OTP component.
   *
   * Focus behavior:
   * 1. Keyboard navigation: Allow normal focus movement
   * 2. Mouse click:
   *    - If clicked box has value: Focus that box
   *    - If clicked box is empty: Focus first empty box
   *
   * Emits the `ionFocus` event when the input group gains focus.
   */
  private onFocus = (index: number) => (event: FocusEvent) => {
    const { inputRefs } = this;
    // Only emit ionFocus and set the focusedValue when the
    // component first gains focus
    if (!this.hasFocus) {
      this.ionFocus.emit(event);
      this.focusedValue = this.value;
    }
    this.hasFocus = true;

    let finalIndex = index;

    if (!this.isKeyboardNavigation) {
      // If the clicked box has a value, focus it
      // Otherwise focus the first empty box
      const targetIndex = this.inputValues[index] ? index : this.getFirstEmptyIndex();
      finalIndex = targetIndex === -1 ? this.length - 1 : targetIndex;

      // Focus the target box
      this.inputRefs[finalIndex]?.focus();
    }

    // Update tabIndexes to match the focused box
    inputRefs.forEach((input, i) => {
      input.tabIndex = i === finalIndex ? 0 : -1;
    });

    // Reset the keyboard navigation flag
    this.isKeyboardNavigation = false;
  };

  /**
   * Handles the blur behavior for the input OTP component.
   * Emits the `ionBlur` event when the input group loses focus.
   */
  private onBlur = (event: FocusEvent) => {
    const { inputRefs } = this;
    const relatedTarget = event.relatedTarget as HTMLElement;

    // Do not emit blur if we're moving to another input box in the same component
    const isInternalFocus = relatedTarget != null && inputRefs.includes(relatedTarget as HTMLInputElement);

    if (!isInternalFocus) {
      this.hasFocus = false;

      // Reset tabIndexes when focus leaves the component
      this.updateTabIndexes();

      // Always emit ionBlur when focus leaves the component
      this.ionBlur.emit(event);

      // Only emit ionChange if the value has actually changed
      if (this.focusedValue !== this.value) {
        this.emitIonChange(event);
      }
    }
  };

  /**
   * Focuses the next input box.
   */
  private focusNext(currentIndex: number) {
    const { inputRefs, length } = this;
    if (currentIndex < length - 1) {
      inputRefs[currentIndex + 1]?.focus();
    }
  }

  /**
   * Focuses the previous input box.
   */
  private focusPrevious(currentIndex: number) {
    const { inputRefs } = this;
    if (currentIndex > 0) {
      inputRefs[currentIndex - 1]?.focus();
    }
  }

  /**
   * Searches through the input values and returns the index
   * of the first empty input.
   * Returns -1 if all inputs are filled.
   */
  private getFirstEmptyIndex() {
    const { inputValues, length } = this;
    // Create an array of the same length as the input OTP
    // and fill it with the input values
    const values = Array.from({ length }, (_, i) => inputValues[i] || '');
    return values.findIndex((value) => !value || value === '') ?? -1;
  }

  /**
   * Returns the index of the input that should be tabbed to.
   * If all inputs are filled, returns the last input's index.
   * Otherwise, returns the index of the first empty input.
   */
  private getTabbableIndex() {
    const { length } = this;
    const firstEmptyIndex = this.getFirstEmptyIndex();
    return firstEmptyIndex === -1 ? length - 1 : firstEmptyIndex;
  }

  /**
   * Updates the tabIndexes for the input boxes.
   * This is used to ensure that the correct input is
   * focused when the user navigates using the tab key.
   */
  private updateTabIndexes() {
    const { inputRefs, inputValues, length } = this;

    // Find first empty index after any filled boxes
    let firstEmptyIndex = -1;
    for (let i = 0; i < length; i++) {
      if (!inputValues[i] || inputValues[i] === '') {
        firstEmptyIndex = i;
        break;
      }
    }

    // Update tabIndex and aria-hidden for all inputs
    inputRefs.forEach((input, index) => {
      const shouldBeTabbable = firstEmptyIndex === -1 ? index === length - 1 : firstEmptyIndex === index;

      input.tabIndex = shouldBeTabbable ? 0 : -1;

      // If the input is empty and not the first empty input,
      // it should be hidden from screen readers.
      const isEmpty = !inputValues[index] || inputValues[index] === '';
      input.setAttribute('aria-hidden', isEmpty && !shouldBeTabbable ? 'true' : 'false');
    });
  }

  /**
   * Handles keyboard navigation and input for the OTP component.
   *
   * Navigation:
   * - Backspace: Clears current input and moves to previous box if empty
   * - Arrow Left/Right: Moves focus between input boxes
   * - Tab: Allows normal tab navigation between components
   *
   * Input Behavior:
   * - Validates input against the allowed pattern
   * - When entering a key in a filled box:
   *   - Shifts existing values right if there is room
   *   - Updates the value of the input group
   *   - Prevents default behavior to avoid automatic focus shift
   */
  private onKeyDown = (index: number) => (event: KeyboardEvent) => {
    const { length } = this;
    const rtl = isRTL(this.el);
    const input = event.target as HTMLInputElement;

    const isPasteShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'v';
    const isTextSelection = input.selectionStart !== input.selectionEnd;

    // Return if the key is the paste shortcut or the input value
    // text is selected and let the onPaste / onInput handler manage it
    if (isPasteShortcut || isTextSelection) {
      return;
    }

    if (event.key === 'Backspace') {
      if (this.inputValues[index]) {
        // Shift all values to the right of the current index left by one
        for (let i = index; i < length - 1; i++) {
          this.inputValues[i] = this.inputValues[i + 1];
        }

        // Clear the last box
        this.inputValues[length - 1] = '';

        // Update all inputRefs to match inputValues
        for (let i = 0; i < length; i++) {
          this.inputRefs[i].value = this.inputValues[i] || '';
        }

        this.updateValue(event);
        event.preventDefault();
      } else if (!this.inputValues[index] && index > 0) {
        // If current input is empty, move to previous input
        this.focusPrevious(index);
      }
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      this.isKeyboardNavigation = true;
      event.preventDefault();
      const isLeft = event.key === 'ArrowLeft';
      const shouldMoveNext = (isLeft && rtl) || (!isLeft && !rtl);

      // Only allow moving to the next input if the current has a value
      if (shouldMoveNext) {
        if (this.inputValues[index] && index < length - 1) {
          this.focusNext(index);
        }
      } else {
        this.focusPrevious(index);
      }
    } else if (event.key === 'Tab') {
      this.isKeyboardNavigation = true;
      // Let all tab events proceed normally
      return;
    }

    // If the input box contains a value and the key being
    // entered is a valid key for the input box update the value
    // and shift the values to the right if there is room.
    if (this.inputValues[index] && this.validKeyPattern.test(event.key)) {
      if (!this.inputValues[length - 1]) {
        for (let i = length - 1; i > index; i--) {
          this.inputValues[i] = this.inputValues[i - 1];
          this.inputRefs[i].value = this.inputValues[i] || '';
        }
      }
      this.inputValues[index] = event.key;
      this.inputRefs[index].value = event.key;
      this.updateValue(event);

      // Prevent default to avoid the browser from
      // automatically moving the focus to the next input
      event.preventDefault();
    }
  };

  private onInput = (index: number) => (event: InputEvent) => {
    const { validKeyPattern } = this;

    const value = (event.target as HTMLInputElement).value;

    // Only allow input if it's a single character and matches the pattern
    if (value.length > 1 || (value.length > 0 && !validKeyPattern.test(value))) {
      // Reset the input value if not valid
      this.inputRefs[index].value = '';
      this.inputValues[index] = '';
      return;
    }

    // Find the first empty box before or at the current index
    let targetIndex = index;
    for (let i = 0; i < index; i++) {
      if (!this.inputValues[i] || this.inputValues[i] === '') {
        targetIndex = i;
        break;
      }
    }

    // Set the value at the target index
    this.inputValues[targetIndex] = value;

    // If the value was entered in a later box, clear the current box
    if (targetIndex !== index) {
      this.inputRefs[index].value = '';
    }

    if (value.length > 0) {
      this.focusNext(targetIndex);
    }
    this.updateValue(event);
  };

  /**
   * Handles pasting text into the input OTP component.
   * This function prevents the default paste behavior and
   * validates the pasted text against the allowed pattern.
   * It then updates the value of the input group and focuses
   * the next empty input after pasting.
   */
  private onPaste = (event: ClipboardEvent) => {
    const { inputRefs, length, validKeyPattern } = this;

    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text');

    // If there is no pasted text, still emit the input change event
    // because this is how the native input element behaves
    // but return early because there is nothing to paste.
    if (!pastedText) {
      this.emitIonInput(event);
      return;
    }

    const validChars = pastedText
      .split('')
      .filter((char) => validKeyPattern.test(char))
      .slice(0, length);

    // Always paste starting at the first box
    validChars.forEach((char, index) => {
      if (index < length) {
        this.inputRefs[index].value = char;
        this.inputValues[index] = char;
      }
    });

    // Update the value so that all input boxes are updated
    this.value = validChars.join('');
    this.updateValue(event);

    // Focus the next empty input after pasting
    // If all boxes are filled, focus the last input
    const nextEmptyIndex = validChars.length;
    if (nextEmptyIndex < length) {
      inputRefs[nextEmptyIndex]?.focus();
    } else {
      inputRefs[length - 1]?.focus();
    }
  };

  /**
   * Determines if a separator should be shown for a given index by
   * checking if the index is included in the parsed separators array.
   */
  private showSeparator(index: number) {
    const { length } = this;
    return this.parsedSeparators.includes(index + 1) && index < length - 1;
  }

  render() {
    const {
      autocapitalize,
      color,
      disabled,
      el,
      fill,
      hasFocus,
      inheritedAttributes,
      inputId,
      inputRefs,
      inputValues,
      length,
      readonly,
      shape,
      size,
    } = this;
    const mode = getIonMode(this);
    const inputmode = this.getInputmode();
    const tabbableIndex = this.getTabbableIndex();
    const pattern = this.getPattern();
    const hasDescription = el.querySelector('.input-otp-description')?.textContent?.trim() !== '';

    return (
      <Host
        class={createColorClasses(color, {
          [mode]: true,
          'has-focus': hasFocus,
          [`input-otp-size-${size}`]: true,
          [`input-otp-shape-${shape}`]: true,
          [`input-otp-fill-${fill}`]: true,
          'input-otp-disabled': disabled,
          'input-otp-readonly': readonly,
        })}
      >
        <div role="group" aria-label="One-time password input" class="input-otp-group" {...inheritedAttributes}>
          {Array.from({ length }).map((_, index) => (
            <>
              <div class="native-wrapper">
                <input
                  class="native-input"
                  id={`${inputId}-${index}`}
                  aria-label={`Input ${index + 1} of ${length}`}
                  type="text"
                  autoCapitalize={autocapitalize}
                  inputmode={inputmode}
                  maxLength={1}
                  pattern={pattern}
                  disabled={disabled}
                  readOnly={readonly}
                  tabIndex={index === tabbableIndex ? 0 : -1}
                  value={inputValues[index] || ''}
                  autocomplete={index === 0 ? 'one-time-code' : 'off'}
                  ref={(el) => (inputRefs[index] = el as HTMLInputElement)}
                  onInput={this.onInput(index)}
                  onBlur={this.onBlur}
                  onFocus={this.onFocus(index)}
                  onKeyDown={this.onKeyDown(index)}
                  onPaste={this.onPaste}
                />
              </div>
              {this.showSeparator(index) && <div class="input-otp-separator" />}
            </>
          ))}
        </div>
        <div
          class={{
            'input-otp-description': true,
            'input-otp-description-hidden': !hasDescription,
          }}
        >
          <slot></slot>
        </div>
      </Host>
    );
  }
}

let inputIds = 0;
