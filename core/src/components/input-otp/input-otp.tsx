import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, h, Watch } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';

import type { InputOtpChangeEventDetail, InputOtpCompleteEventDetail } from './input-otp-interface';

@Component({
  tag: 'ion-input-otp',
  styleUrls: {
    ios: 'input-otp.ios.scss',
    md: 'input-otp.md.scss',
  },
  scoped: true,
})
export class InputOTP implements ComponentInterface {
  private inputRefs: HTMLInputElement[] = [];
  private inputId = `ion-input-otp-${inputIds++}`;

  @Element() el!: HTMLIonInputOtpElement;

  @State() private inputValues: string[] = [];
  @State() hasFocus = false;

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
   * For numbers (type="number"): "[0-9]"
   * For text (type="text"): "[a-zA-Z0-9]"
   */
  @Prop() allowedKeys?: string;

  /**
   * If `true`, the user cannot modify the value.
   */
  @Prop({ reflect: true }) readonly = false;

  /**
   * The size of the input boxes.
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

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
   * The type of input allowed in the input boxes.
   */
  @Prop() type: 'text' | 'number' = 'number';

  /**
   * The value of the OTP input.
   */
  @Prop({ mutable: true }) value?: string | number | null = '';

  /**
   * Emitted when the value changes
   */
  @Event() ionChange!: EventEmitter<InputOtpChangeEventDetail>;

  /**
   * Emitted when the input is complete (all boxes filled)
   */
  @Event() ionComplete!: EventEmitter<InputOtpCompleteEventDetail>;

  @Watch('value')
  valueChanged() {
    this.initializeValues();
  }

  componentWillLoad() {
    this.initializeValues();
  }

  private initializeValues() {
    if (this.value != null && String(this.value).length > 0) {
      const chars = String(this.value).split('').slice(0, this.length);
      chars.forEach((char, index) => {
        if (this.validKeys.test(char.toLowerCase())) {
          this.inputValues[index] = char;
        }
      });
      // Update the value without emitting events
      this.value = this.inputValues.join('');
    }
  }

  /**
   * Get the default allowed keys based on type if not explicitly set
   */
  private get validKeys(): RegExp {
    if (this.allowedKeys) {
      // Create a regex that matches a single character from the provided pattern
      return new RegExp(`^${this.allowedKeys}$`, 'i');
    }
    return this.type === 'number' ? /^[0-9]$/ : /^[a-zA-Z0-9]$/i;
  }

  /**
   * Get the default value for inputmode based on type if not explicitly set
   */
  private getInputmode(): string {
    if (this.inputmode) {
      return this.inputmode;
    }

    if (this.type == 'number') {
      return 'numeric';
    } else {
      return 'text';
    }
  }

  private updateValue() {
    const newValue = this.inputValues.join('');
    this.value = newValue;
    this.ionChange.emit({
      value: newValue,
      complete: newValue.length === this.length,
    });

    if (newValue.length === this.length) {
      this.ionComplete.emit({ value: newValue });
    }
  }

  private handleInput(index: number, value: string) {
    // Only allow input if it's a single character and matches the pattern
    if (value.length > 1 || (value.length > 0 && !this.validKeys.test(value.toLowerCase()))) {
      // Reset the input value if not valid
      this.inputRefs[index].value = '';
      this.inputValues[index] = '';
      return;
    }

    this.inputValues[index] = value;

    if (value.length > 0) {
      this.focusNext(index);
    }
    this.updateValue();
  }

  private handleKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      if (this.inputValues[index]) {
        // If current input has a value, clear it
        this.inputRefs[index].value = '';
        this.inputValues[index] = '';
        this.updateValue();
      } else if (index > 0) {
        // If current input is empty, move to previous input and clear its value
        this.focusPrevious(index);
        this.inputRefs[index - 1].value = '';
        this.inputValues[index - 1] = '';
        this.updateValue();
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusPrevious(index);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      // Only allow moving right if current box has a value
      if (this.inputValues[index] && index < this.length - 1) {
        this.focusNext(index);
      }
    } else if (event.key === 'Tab') {
      // Let all tab events proceed normally
      return;
    }
  }

  private handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const validChars = pastedText
      .split('')
      .filter((char) => this.validKeys.test(char.toLowerCase()))
      .slice(0, this.length);

    // Find the currently focused input
    const focusedIndex = this.inputRefs.findIndex((input) => input === document.activeElement);
    const startIndex = focusedIndex >= 0 ? focusedIndex : 0;

    validChars.forEach((char, index) => {
      const targetIndex = startIndex + index;
      if (targetIndex < this.length) {
        this.inputRefs[targetIndex].value = char;
        this.inputValues[targetIndex] = char;
      }
    });

    this.updateValue();

    // Focus the next empty input after pasting
    const nextEmptyIndex = startIndex + validChars.length;
    if (nextEmptyIndex < this.length) {
      this.inputRefs[nextEmptyIndex]?.focus();
    }
  }

  private focusNext(currentIndex: number) {
    if (currentIndex < this.length - 1) {
      this.inputRefs[currentIndex + 1]?.focus();
    }
  }

  private focusPrevious(currentIndex: number) {
    if (currentIndex > 0) {
      this.inputRefs[currentIndex - 1]?.focus();
    }
  }

  private get parsedSeparators(): number[] {
    if (this.separators === undefined) {
      return [];
    }
    if (Array.isArray(this.separators)) {
      return this.separators;
    }
    return this.separators
      .split(',')
      .map((pos) => parseInt(pos, 10))
      .filter((pos) => !isNaN(pos));
  }

  private showSeparator(index: number) {
    if (this.separators === 'all') {
      return index < this.length - 1;
    }
    return this.parsedSeparators.includes(index + 1) && index < this.length - 1;
  }

  private handleFocus(index: number) {
    this.hasFocus = true;
    // When an input receives focus, make it the only tabbable element
    this.inputRefs.forEach((input, i) => {
      input.tabIndex = i === index ? 0 : -1;
    });
  }

  private handleBlur(ev: FocusEvent) {
    const relatedTarget = ev.relatedTarget as HTMLElement;
    if (relatedTarget == null || !this.inputRefs.includes(relatedTarget as HTMLInputElement)) {
      this.hasFocus = false;
      // Reset tabIndexes when focus leaves the component
      this.updateTabIndexes();
    }
  }

  private updateTabIndexes() {
    // Find first empty index after any filled boxes
    let firstEmptyIndex = -1;
    for (let i = 0; i < this.length; i++) {
      if (!this.inputValues[i] || this.inputValues[i] === '') {
        firstEmptyIndex = i;
        break;
      }
    }

    // Update tabIndex for all inputs
    this.inputRefs.forEach((input, index) => {
      // If all boxes are filled, make the last box tabbable
      // Otherwise, make the first empty box tabbable
      const shouldBeTabbable = firstEmptyIndex === -1 ? index === this.length - 1 : firstEmptyIndex === index;

      input.tabIndex = shouldBeTabbable ? 0 : -1;
    });
  }

  /**
   * Loops through the input values and returns the index
   * of the first empty input.
   * Returns -1 if all inputs are filled.
   */
  private getFirstEmptyIndex() {
    for (let i = 0; i < this.length; i++) {
      if (!this.inputValues[i] || this.inputValues[i] === '') {
        return i;
      }
    }
    return -1;
  }

  /**
   * Returns the index of the input that should be tabbed to.
   * If all inputs are filled, returns the last input's index.
   * Otherwise, returns the index of the first empty input.
   */
  private getTabbableIndex() {
    const firstEmptyIndex = this.getFirstEmptyIndex();
    return firstEmptyIndex === -1 ? this.length - 1 : firstEmptyIndex;
  }

  render() {
    const mode = getIonMode(this);
    const tabbableIndex = this.getTabbableIndex();

    return (
      <Host
        class={createColorClasses(this.color, {
          [mode]: true,
          'has-focus': this.hasFocus,
          [`input-otp-size-${this.size}`]: true,
          [`input-otp-shape-${this.shape}`]: true,
          [`input-otp-fill-${this.fill}`]: true,
          'input-otp-disabled': this.disabled,
          'input-otp-readonly': this.readonly,
        })}
      >
        <div role="group" aria-label="One-time password input" class="input-otp-group">
          {Array.from({ length: this.length }).map((_, index) => {
            return (
              <div class="native-wrapper">
                <input
                  class="native-input"
                  id={`${this.inputId}-${index}`}
                  type="text"
                  inputmode={this.getInputmode()}
                  maxLength={1}
                  pattern={this.type === 'number' ? '[0-9]' : undefined}
                  disabled={this.disabled}
                  readOnly={this.readonly}
                  tabIndex={index === tabbableIndex ? 0 : -1}
                  value={this.inputValues[index] || ''}
                  autocomplete={index === 0 ? 'one-time-code' : 'off'}
                  ref={(el) => (this.inputRefs[index] = el as HTMLInputElement)}
                  onInput={(e) => this.handleInput(index, (e.target as HTMLInputElement).value)}
                  onKeyDown={(e) => this.handleKeyDown(index, e)}
                  onPaste={(e) => this.handlePaste(e)}
                  onFocus={() => this.handleFocus(index)}
                  onBlur={(e) => this.handleBlur(e)}
                />
                {this.showSeparator(index) && <div class="input-otp-separator" />}
              </div>
            );
          })}
        </div>
        <div class="input-otp-description">
          <slot></slot>
        </div>
      </Host>
    );
  }
}

let inputIds = 0;
