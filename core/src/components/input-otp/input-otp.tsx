import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, h, Watch } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';

export interface InputOTPChangeEventDetail {
  value: string;
  complete: boolean;
}

export interface InputOTPCompleteEventDetail {
  value: string;
}

export interface HTMLIonInputOTPElement extends HTMLElement {
  value?: string;
}

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

  @Element() el!: HTMLIonInputOTPElement;

  @State() private inputValues: string[] = [];
  @State() hasFocus = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * The number of input boxes to display
   */
  @Prop() length = 4;

  /**
   * The type of input allowed in the boxes
   */
  @Prop() type: 'text' | 'number' = 'number';

  /**
   * A regex pattern string for allowed characters. Defaults based on type.
   *
   * For numbers (type="number"): "[0-9]"
   * For text (type="text"): "[a-zA-Z0-9]"
   */
  @Prop() allowedKeys?: string;

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
   * The size of the input boxes
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Whether to show separators between input boxes
   */
  @Prop() separator1 = false;
  @Prop() separator2 = false;
  @Prop() separator3 = false;
  @Prop() separator4 = false;
  @Prop() separator5 = false;

  /**
   * The fill style of the input boxes
   */
  @Prop() fill: 'solid' | 'outline' = 'outline';

  /**
   * The shape of the input boxes
   */
  @Prop() shape: 'round' | 'rectangular' | 'soft' = 'round';

  /**
   * Whether the input is disabled
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The value of the OTP input
   */
  @Prop({ mutable: true }) value?: string = '';

  /**
   * Emitted when the value changes
   */
  @Event() ionChange!: EventEmitter<InputOTPChangeEventDetail>;

  /**
   * Emitted when the input is complete (all boxes filled)
   */
  @Event() ionComplete!: EventEmitter<InputOTPCompleteEventDetail>;

  componentWillLoad() {
    this.separatorChanged();
  }

  // TODO is this a Stencil bug with ending in numbers?
  @Watch('separator1')
  @Watch('separator2')
  @Watch('separator3')
  @Watch('separator4')
  @Watch('separator5')
  separatorChanged() {
    ['1', '2', '3', '4', '5'].forEach((num) => {
      const prop = `separator${num}` as keyof InputOTP;
      if (this.el.hasAttribute(prop)) {
        const attrValue = this.el.getAttribute(prop);
        (this as any)[prop] = attrValue === '' || attrValue === 'true';
      }
    });
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

    validChars.forEach((char, index) => {
      this.inputRefs[index].value = char;
      this.inputValues[index] = char;
    });

    this.updateValue();

    // Focus the next empty input after pasting
    const nextEmptyIndex = validChars.length;
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

  private showSeparator(index: number) {
    return (
      (index === 0 && this.separator1) ||
      (index === 1 && this.separator2) ||
      (index === 2 && this.separator3) ||
      (index === 3 && this.separator4) ||
      (index === 4 && this.separator5)
    );
  }

  private handleBlur(ev: FocusEvent) {
    const relatedTarget = ev.relatedTarget as HTMLElement;
    if (relatedTarget == null ||
        !this.inputRefs.includes(relatedTarget as HTMLInputElement)) {
      this.hasFocus = false;
    }
  }

  render() {
    const mode = getIonMode(this);

    return (
      <Host
        class={createColorClasses(this.color, {
          [mode]: true,
          'has-focus': this.hasFocus,
          [`input-otp-size-${this.size}`]: true,
          [`input-otp-shape-${this.shape}`]: true,
          [`input-otp-fill-${this.fill}`]: true,
          'input-otp-disabled': this.disabled,
        })}
      >
        <div role="group" aria-label="One-time password input" class="input-otp-group">
          {Array.from({ length: this.length }).map((_, index) => {
            // Find first empty index after any filled boxes
            let firstEmptyIndex = -1;
            for (let i = 0; i < this.length; i++) {
              if (!this.inputValues[i] || this.inputValues[i] === '') {
                firstEmptyIndex = i;
                break;
              }
            }
            // If all boxes are filled, make the last box tabbable
            const shouldBeTabbable = firstEmptyIndex === -1 ?
              index === this.length - 1 :
              firstEmptyIndex === index;

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
                  tabIndex={shouldBeTabbable ? 0 : -1}
                  ref={(el) => (this.inputRefs[index] = el as HTMLInputElement)}
                  onInput={(e) => this.handleInput(index, (e.target as HTMLInputElement).value)}
                  onKeyDown={(e) => this.handleKeyDown(index, e)}
                  onPaste={(e) => this.handlePaste(e)}
                  onFocus={() => (this.hasFocus = true)}
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

