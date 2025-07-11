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
  @State() private previousInputValues: string[] = [];

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
    this.updateTabIndexes();
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
    this.previousInputValues = [...this.inputValues];
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
   * Handles keyboard navigation for the OTP component.
   *
   * Navigation:
   * - Backspace: Clears current input and moves to previous box if empty
   * - Arrow Left/Right: Moves focus between input boxes
   * - Tab: Allows normal tab navigation between components
   */
  private onKeyDown = (index: number) => (event: KeyboardEvent) => {
    const { length } = this;
    const rtl = isRTL(this.el);
    const input = event.target as HTMLInputElement;

    // Meta shortcuts are used to copy, paste, and select text
    // We don't want to handle these keys here
    const metaShortcuts = ['a', 'c', 'v', 'x', 'r', 'z', 'y'];
    const isTextSelection = input.selectionStart !== input.selectionEnd;

    // Return if the key is a meta shortcut or the input value
    // text is selected and let the onPaste / onInput handler manage it
    if (isTextSelection || ((event.metaKey || event.ctrlKey) && metaShortcuts.includes(event.key.toLowerCase()))) {
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
  };

  /**
   * Processes all input scenarios for each input box.
   *
   * This function manages:
   * 1. Autofill handling
   * 2. Input validation
   * 3. Full selection replacement or typing in an empty box
   * 4. Inserting in the middle with available space (shifting)
   * 5. Single character replacement
   */
  private onInput = (index: number) => (event: InputEvent) => {
    const { length, validKeyPattern } = this;
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const previousValue = this.previousInputValues[index] || '';

    // 1. Autofill handling
    // If the length of the value increases by more than 1 from the previous
    // value, treat this as autofill. This is to prevent the case where the
    // user is typing a single character into an input box containing a value
    // as that will trigger this function with a value length of 2 characters.
    const isAutofill = value.length - previousValue.length > 1;
    if (isAutofill) {
      // Distribute valid characters across input boxes
      const validChars = value
        .split('')
        .filter((char) => validKeyPattern.test(char))
        .slice(0, length);

      // If there are no valid characters coming from the
      // autofill, all input refs have to be cleared after the
      // browser has finished the autofill behavior
      if (validChars.length === 0) {
        requestAnimationFrame(() => {
          this.inputRefs.forEach((input) => {
            input.value = '';
          });
        });
      }

      for (let i = 0; i < length; i++) {
        this.inputValues[i] = validChars[i] || '';
        this.inputRefs[i].value = validChars[i] || '';
      }
      this.updateValue(event);

      // Focus the first empty input box or the last input box if all boxes
      // are filled after a small delay to ensure the input boxes have been
      // updated before moving the focus
      setTimeout(() => {
        const nextIndex = validChars.length < length ? validChars.length : length - 1;
        this.inputRefs[nextIndex]?.focus();
      }, 20);

      this.previousInputValues = [...this.inputValues];
      return;
    }

    // 2. Input validation
    // If the character entered is invalid (does not match the pattern),
    // restore the previous value and exit
    if (value.length > 0 && !validKeyPattern.test(value[value.length - 1])) {
      input.value = this.inputValues[index] || '';
      this.previousInputValues = [...this.inputValues];
      return;
    }

    // 3. Full selection replacement or typing in an empty box
    // If the user selects all text in the input box and types, or if the
    // input box is empty, replace only this input box. If the box is empty,
    // move to the next box, otherwise stay focused on this box.
    const isAllSelected = input.selectionStart === 0 && input.selectionEnd === value.length;
    const isEmpty = !this.inputValues[index];
    if (isAllSelected || isEmpty) {
      this.inputValues[index] = value;
      input.value = value;
      this.updateValue(event);
      this.focusNext(index);
      this.previousInputValues = [...this.inputValues];
      return;
    }

    // 4. Inserting in the middle with available space (shifting)
    // If typing in a filled input box and there are empty boxes at the end,
    // shift all values starting at the current box to the right, and insert
    // the new character at the current box.
    const hasAvailableBoxAtEnd = this.inputValues[this.inputValues.length - 1] === '';
    if (this.inputValues[index] && hasAvailableBoxAtEnd && value.length === 2) {
      // Get the inserted character (from event or by diffing value/previousValue)
      let newChar = (event as InputEvent).data;
      if (!newChar) {
        newChar = value.split('').find((c, i) => c !== previousValue[i]) || value[value.length - 1];
      }
      // Validate the new character before shifting
      if (!validKeyPattern.test(newChar)) {
        input.value = this.inputValues[index] || '';
        this.previousInputValues = [...this.inputValues];
        return;
      }
      // Shift values right from the end to the insertion point
      for (let i = this.inputValues.length - 1; i > index; i--) {
        this.inputValues[i] = this.inputValues[i - 1];
        this.inputRefs[i].value = this.inputValues[i] || '';
      }
      this.inputValues[index] = newChar;
      this.inputRefs[index].value = newChar;
      this.updateValue(event);
      this.previousInputValues = [...this.inputValues];
      return;
    }

    // 5. Single character replacement
    // Handles replacing a single character in a box containing a value based
    // on the cursor position. We need the cursor position to determine which
    // character was the last character typed. For example, if the user types "2"
    // in an input box with the cursor at the beginning of the value of "6",
    // the value will be "26", but we want to grab the "2" as the last character
    // typed.
    const cursorPos = input.selectionStart ?? value.length;
    const newCharIndex = cursorPos - 1;
    const newChar = value[newCharIndex] ?? value[0];

    // Check if the new character is valid before updating the value
    if (!validKeyPattern.test(newChar)) {
      input.value = this.inputValues[index] || '';
      this.previousInputValues = [...this.inputValues];
      return;
    }

    this.inputValues[index] = newChar;
    input.value = newChar;
    this.updateValue(event);
    this.previousInputValues = [...this.inputValues];
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
    const nextEmptyIndex = validChars.length < length ? validChars.length : length - 1;
    inputRefs[nextEmptyIndex]?.focus();
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
                  pattern={pattern}
                  disabled={disabled}
                  readOnly={readonly}
                  tabIndex={index === tabbableIndex ? 0 : -1}
                  value={inputValues[index] || ''}
                  autocomplete="one-time-code"
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
