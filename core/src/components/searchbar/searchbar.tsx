import { Component, ComponentInterface, Element, Event, EventEmitter, Method, Prop, State, Watch, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { Color, SearchbarChangeEventDetail } from '../../interface';
import { debounceEvent } from '../../utils/helpers';
import { sanitizeDOMString } from '../../utils/sanitization';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-searchbar',
  styleUrls: {
    ios: 'searchbar.ios.scss',
    md: 'searchbar.md.scss'
  },
  scoped: true
})
export class Searchbar implements ComponentInterface {

  private nativeInput?: HTMLInputElement;
  private isCancelVisible = false;
  private shouldAlignLeft = true;

  @Element() el!: HTMLIonSearchbarElement;

  @State() focused = false;
  @State() noAnimate = true;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * If `true`, enable searchbar animation.
   */
  @Prop() animated = false;

  /**
   * Set the input's autocomplete property.
   */
  @Prop() autocomplete: 'on' | 'off' = 'off';

  /**
   * Set the input's autocorrect property.
   */
  @Prop() autocorrect: 'on' | 'off' = 'off';

  /**
   * Set the cancel button icon. Only applies to `md` mode.
   */
  @Prop() cancelButtonIcon = 'md-arrow-back';

  /**
   * Set the the cancel button text. Only applies to `ios` mode.
   */
  @Prop() cancelButtonText = 'Cancel';

  /**
   * Set the clear icon. Defaults to `"close-circle"` for `ios` and `"close"` for `md`.
   */
  @Prop() clearIcon?: string;

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke.
   */
  @Prop() debounce = 250;

  @Watch('debounce')
  protected debounceChanged() {
    this.ionChange = debounceEvent(this.ionChange, this.debounce);
  }

  /**
   * If `true`, the user cannot interact with the input.
   */
  @Prop() disabled = false;

  /**
   * Set the input's placeholder.
   * `placeholder` can accept either plaintext or HTML as a string.
   * To display characters normally reserved for HTML, they
   * must be escaped. For example `<Ionic>` would become
   * `&lt;Ionic&gt;`
   *
   * For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
   */
  @Prop() placeholder = 'Search';

  /**
   * The icon to use as the search icon.
   */
  @Prop() searchIcon = 'search';

  /**
   * Sets the behavior for the cancel button. Defaults to `"never"`.
   * Setting to `"focus"` shows the cancel button on focus.
   * Setting to `"never"` hides the cancel button.
   * Setting to `"always"` shows the cancel button regardless
   * of focus state.
   */
  @Prop() showCancelButton: boolean | string = 'never';

  /**
   * If `true`, enable spellcheck on the input.
   */
  @Prop() spellcheck = false;

  /**
   * Set the type of the input.
   */
  @Prop() type: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' = 'search';

  /**
   * the value of the searchbar.
   */
  @Prop({ mutable: true }) value?: string | null = '';

  /**
   * Emitted when a keyboard input ocurred.
   */
  @Event() ionInput!: EventEmitter<KeyboardEvent>;

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange!: EventEmitter<SearchbarChangeEventDetail>;

  /**
   * Emitted when the cancel button is clicked.
   */
  @Event() ionCancel!: EventEmitter<void>;

  /**
   * Emitted when the clear input button is clicked.
   */
  @Event() ionClear!: EventEmitter<void>;

  /**
   * Emitted when the input loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * Emitted when the input has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  @Watch('value')
  protected valueChanged() {
    const inputEl = this.nativeInput;
    const value = this.getValue();
    if (inputEl && inputEl.value !== value) {
      inputEl.value = value;
    }
    this.ionChange.emit({ value });
  }

  @Watch('showCancelButton')
  protected showCancelButtonChanged() {
    requestAnimationFrame(() => {
      this.positionElements();
      this.el.forceUpdate();
    });
  }

  componentDidLoad() {
    this.positionElements();
    this.debounceChanged();

    setTimeout(() => {
      this.noAnimate = false;
    }, 300);
  }

  /**
   * Sets focus on the specified `ion-searchbar`. Use this method instead of the global
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
   * Clears the input field and triggers the control change.
   */
  private onClearInput = (ev?: Event) => {
    this.ionClear.emit();

    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    // setTimeout() fixes https://github.com/ionic-team/ionic/issues/7527
    // wait for 4 frames
    setTimeout(() => {
      const value = this.getValue();
      if (value !== '') {
        this.value = '';
        this.ionInput.emit();
      }
    }, 16 * 4);
  }

  /**
   * Clears the input field and tells the input to blur since
   * the clearInput function doesn't want the input to blur
   * then calls the custom cancel function if the user passed one in.
   */
  private onCancelSearchbar = (ev?: Event) => {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.ionCancel.emit();
    this.onClearInput();

    if (this.nativeInput) {
      this.nativeInput.blur();
    }
  }

  /**
   * Update the Searchbar input value when the input changes
   */
  private onInput = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    if (input) {
      this.value = input.value;
    }
    this.ionInput.emit(ev as KeyboardEvent);
  }

  /**
   * Sets the Searchbar to not focused and checks if it should align left
   * based on whether there is a value in the searchbar or not.
   */
  private onBlur = () => {
    this.focused = false;
    this.ionBlur.emit();
    this.positionElements();
  }

  /**
   * Sets the Searchbar to focused and active on input focus.
   */
  private onFocus = () => {
    this.focused = true;
    this.ionFocus.emit();
    this.positionElements();
  }

  /**
   * Positions the input search icon, placeholder, and the cancel button
   * based on the input value and if it is focused. (ios only)
   */
  private positionElements() {
    const value = this.getValue();
    const prevAlignLeft = this.shouldAlignLeft;
    const mode = getIonMode(this);
    const shouldAlignLeft = (!this.animated || value.trim() !== '' || !!this.focused);
    this.shouldAlignLeft = shouldAlignLeft;

    if (mode !== 'ios') {
      return;
    }

    if (prevAlignLeft !== shouldAlignLeft) {
      this.positionPlaceholder();
    }

    if (this.animated) {
      this.positionCancelButton();
    }
  }

  /**
   * Positions the input placeholder
   */
  private positionPlaceholder() {
    const inputEl = this.nativeInput;
    if (!inputEl) {
      return;
    }
    const isRTL = document.dir === 'rtl';
    const iconEl = (this.el.shadowRoot || this.el).querySelector('.searchbar-search-icon') as HTMLElement;

    if (this.shouldAlignLeft) {
      inputEl.removeAttribute('style');
      iconEl.removeAttribute('style');

    } else {
      // Create a dummy span to get the placeholder width
      const doc = document;
      const tempSpan = doc.createElement('span');
      tempSpan.innerHTML = sanitizeDOMString(this.placeholder) || '';
      doc.body.appendChild(tempSpan);

      // Get the width of the span then remove it
      const textWidth = tempSpan.offsetWidth;
      tempSpan.remove();

      // Calculate the input padding
      const inputLeft = 'calc(50% - ' + (textWidth / 2) + 'px)';

      // Calculate the icon margin
      const iconLeft = 'calc(50% - ' + ((textWidth / 2) + 30) + 'px)';

      // Set the input padding start and icon margin start
      if (isRTL) {
        inputEl.style.paddingRight = inputLeft;
        iconEl.style.marginRight = iconLeft;
      } else {
        inputEl.style.paddingLeft = inputLeft;
        iconEl.style.marginLeft = iconLeft;
      }
    }
  }

  /**
   * Show the iOS Cancel button on focus, hide it offscreen otherwise
   */
  private positionCancelButton() {
    const isRTL = document.dir === 'rtl';
    const cancelButton = (this.el.shadowRoot || this.el).querySelector('.searchbar-cancel-button') as HTMLElement;
    const shouldShowCancel = this.shouldShowCancelButton();

    if (cancelButton && shouldShowCancel !== this.isCancelVisible) {
      const cancelStyle = cancelButton.style;
      this.isCancelVisible = shouldShowCancel;
      if (shouldShowCancel) {
        if (isRTL) {
          cancelStyle.marginLeft = '0';
        } else {
          cancelStyle.marginRight = '0';
        }
      } else {
        const offset = cancelButton.offsetWidth;
        if (offset > 0) {
          if (isRTL) {
            cancelStyle.marginLeft = -offset + 'px';
          } else {
            cancelStyle.marginRight = -offset + 'px';
          }
        }
      }
    }
  }

  private getValue() {
    return this.value || '';
  }

  private hasValue(): boolean {
    return this.getValue() !== '';
  }

  /**
   * Determines whether or not the cancel button should be visible onscreen.
   * Cancel button should be shown if one of two conditions applies:
   * 1. `showCancelButton` is set to `always`.
   * 2. `showCancelButton` is set to `focus`, and the searchbar has been focused.
   */
  private shouldShowCancelButton(): boolean {
    if (
      isCancelButtonSetToNever(this.showCancelButton) ||
      (isCancelButtonSetToFocus(this.showCancelButton) && !this.focused)
    ) { return false; }

    return true;
  }

  hostData() {
    const animated = this.animated && config.getBoolean('animated', true);
    const mode = getIonMode(this);

    return {
      'aria-disabled': this.disabled ? 'true' : null,
      class: {
        ...createColorClasses(this.color),
        [mode]: true,
        'searchbar-animated': animated,
        'searchbar-disabled': this.disabled,
        'searchbar-no-animate': animated && this.noAnimate,
        'searchbar-has-value': this.hasValue(),
        'searchbar-left-aligned': this.shouldAlignLeft,
        'searchbar-has-focus': this.focused,
        'searchbar-should-show-cancel': this.shouldShowCancelButton()
      }
    };
  }

  render() {
    const mode = getIonMode(this);
    const clearIcon = this.clearIcon || (mode === 'ios' ? 'ios-close-circle' : 'md-close');
    const searchIcon = this.searchIcon;

    const cancelButton = !isCancelButtonSetToNever(this.showCancelButton) && (
      <button
        type="button"
        tabIndex={mode === 'ios' && !this.shouldShowCancelButton() ? -1 : undefined}
        onMouseDown={this.onCancelSearchbar}
        onTouchStart={this.onCancelSearchbar}
        class="searchbar-cancel-button"
      >
        <div>
          { mode === 'md'
            ? <ion-icon mode={mode} icon={this.cancelButtonIcon} lazy={false}></ion-icon>
            : this.cancelButtonText
          }
        </div>
      </button>
    );

    return [
      <div class="searchbar-input-container">
        <input
          disabled={this.disabled}
          ref={el => this.nativeInput = el}
          class="searchbar-input"
          onInput={this.onInput}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          placeholder={this.placeholder}
          type={this.type}
          value={this.getValue()}
          autoComplete={this.autocomplete}
          autoCorrect={this.autocorrect}
          spellCheck={this.spellcheck}
        />

        {mode === 'md' && cancelButton}

        <ion-icon mode={mode} icon={searchIcon} lazy={false} class="searchbar-search-icon"></ion-icon>

        <button
          type="button"
          no-blur
          class="searchbar-clear-button"
          onMouseDown={this.onClearInput}
          onTouchStart={this.onClearInput}
        >
          <ion-icon mode={mode} icon={clearIcon} lazy={false} class="searchbar-clear-icon"></ion-icon>
        </button>
      </div>,
      mode === 'ios' && cancelButton
    ];
  }
}

/**
 * Check if the cancel button should never be shown.
 *
 * TODO: Remove this when the `true` and `false`
 * options are removed.
 */
const isCancelButtonSetToNever = (showCancelButton: boolean | string): boolean => {
  return (
    showCancelButton === 'never' ||
    showCancelButton === 'false' ||
    showCancelButton === false
  );
};

/**
 * Check if the cancel button should be shown on focus.
 *
 * TODO: Remove this when the `true` and `false`
 * options are removed.
 */
const isCancelButtonSetToFocus = (showCancelButton: boolean | string): boolean => {
  return (
    showCancelButton === 'focus' ||
    showCancelButton === 'true' ||
    showCancelButton === true ||
    showCancelButton === ''
  );
};
