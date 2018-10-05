import { Component, ComponentInterface, Element, Event, EventEmitter, Method, Prop, State, Watch } from '@stencil/core';

import { Color, Mode, TextInputChangeEvent } from '../../interface';
import { debounceEvent } from '../../utils/helpers';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-searchbar',
  styleUrls: {
    ios: 'searchbar.ios.scss',
    md: 'searchbar.md.scss'
  },
  scoped: true
})
export class Searchbar implements ComponentInterface {

  private nativeInput!: HTMLInputElement;
  private isCancelVisible = false;
  private shouldAlignLeft = true;

  @Element() el!: HTMLElement;

  @Prop({ context: 'document' }) doc!: Document;

  @State() focused = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * If true, enable searchbar animation. Default `false`.
   */
  @Prop() animated = false;

  /**
   * Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @Prop() autocomplete = 'off';

  /**
   * Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @Prop() autocorrect = 'off';

  /**
   * Set the cancel button icon. Only applies to `md` mode. Defaults to `"md-arrow-back"`.
   */
  @Prop() cancelButtonIcon = 'md-arrow-back';

  /**
   * Set the the cancel button text. Only applies to `ios` mode. Default: `"Cancel"`.
   */
  @Prop() cancelButtonText = 'Cancel';

  /**
   * Set the clear icon. Defaults to `"close-circle"` for `ios` and `"close"` for `md`.
   */
  @Prop() clearIcon?: string;

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `250`.
   */
  @Prop() debounce = 250;

  @Watch('debounce')
  protected debounceChanged() {
    this.ionChange = debounceEvent(this.ionChange, this.debounce);
  }

  /**
   * Set the input's placeholder. Default `"Search"`.
   */
  @Prop() placeholder = 'Search';

  /**
   * The icon to use as the search icon. Defaults to `"search"`.
   */
  @Prop() searchIcon?: string;

  /**
   * If true, show the cancel button. Default `false`.
   */
  @Prop() showCancelButton = false;

  /**
   * If true, enable spellcheck on the input. Default `false`.
   */
  @Prop() spellcheck = false;

  /**
   * Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
   */
  @Prop() type = 'search';

  /**
   * the value of the searchbar.
   */
  @Prop({ mutable: true }) value = '';

  /**
   * Emitted when a keyboard input ocurred.
   */
  @Event() ionInput!: EventEmitter<KeyboardEvent>;

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange!: EventEmitter<TextInputChangeEvent>;

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
    const value = this.value;
    if (inputEl && inputEl.value !== value) {
      inputEl.value = value;
    }
    this.ionChange.emit({ value });
  }

  componentDidLoad() {
    this.positionElements();
    this.debounceChanged();
  }

  @Method()
  setFocus() {
    this.nativeInput.focus();
  }

  /**
   * Clears the input field and triggers the control change.
   */
  private clearInput(ev?: Event) {
    this.ionClear.emit();

    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    // setTimeout() fixes https://github.com/ionic-team/ionic/issues/7527
    // wait for 4 frames
    setTimeout(() => {
      const value = this.value;
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
  private cancelSearchbar(ev?: Event) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.ionCancel.emit();
    this.clearInput();

    this.nativeInput.blur();
  }

  /**
   * Update the Searchbar input value when the input changes
   */
  private onInput(ev: KeyboardEvent) {
    const input = ev.target as HTMLInputElement | null;
    if (input) {
      this.value = input.value;
    }
    this.ionInput.emit(ev);
  }

  /**
   * Sets the Searchbar to not focused and checks if it should align left
   * based on whether there is a value in the searchbar or not.
   */
  private onBlur() {
    this.focused = false;
    this.ionBlur.emit();
    this.positionElements();
  }

  /**
   * Sets the Searchbar to focused and active on input focus.
   */
  private onFocus() {
    this.focused = true;
    this.ionFocus.emit();
    this.positionElements();
  }

  /**
   * Positions the input search icon, placeholder, and the cancel button
   * based on the input value and if it is focused. (ios only)
   */
  private positionElements() {
    const prevAlignLeft = this.shouldAlignLeft;
    const shouldAlignLeft = (!this.animated || (this.value && this.value.toString().trim() !== '') || !!this.focused);
    this.shouldAlignLeft = shouldAlignLeft;

    if (this.mode !== 'ios') {
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
    const isRTL = this.doc.dir === 'rtl';
    const inputEl = this.nativeInput;
    const iconEl = (this.el.shadowRoot || this.el).querySelector('.searchbar-search-icon') as HTMLElement;

    if (this.shouldAlignLeft) {
      inputEl.removeAttribute('style');
      iconEl.removeAttribute('style');

    } else {
      // Create a dummy span to get the placeholder width
      const doc = this.doc;
      const tempSpan = doc.createElement('span');
      tempSpan.innerHTML = this.placeholder;
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
    const isRTL = this.doc.dir === 'rtl';
    const cancelButton = (this.el.shadowRoot || this.el).querySelector('.searchbar-cancel-button') as HTMLElement;
    const shouldShowCancel = this.focused;

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

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        'searchbar-animated': this.animated,
        'searchbar-has-value': (this.value !== ''),
        'searchbar-show-cancel': this.showCancelButton,
        'searchbar-left-aligned': this.shouldAlignLeft,
        'searchbar-has-focus': this.focused
      }
    };
  }

  render() {
    const clearIcon = this.clearIcon || (this.mode === 'ios' ? 'ios-close-circle' : 'md-close');
    const searchIcon = this.searchIcon || 'search';

    const cancelButton = this.showCancelButton && (
      <button
        type="button"
        tabIndex={this.mode === 'ios' && !this.focused ? -1 : undefined}
        onMouseDown={this.cancelSearchbar.bind(this)}
        onTouchStart={this.cancelSearchbar.bind(this)}
        class="searchbar-cancel-button"
      >
        { this.mode === 'md'
          ? <ion-icon mode={this.mode} icon={this.cancelButtonIcon} lazy={false}></ion-icon>
          : this.cancelButtonText
        }
      </button>
    );

    return [
      <div class="searchbar-input-container">
        <input
          ref={el => this.nativeInput = el as HTMLInputElement}
          class="searchbar-input"
          onInput={this.onInput.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onFocus={this.onFocus.bind(this)}
          placeholder={this.placeholder}
          type={this.type}
          value={this.value}
          autoComplete={this.autocomplete}
          autoCorrect={this.autocorrect}
          spellCheck={this.spellcheck}
        />

        {this.mode === 'md' && cancelButton}

        <ion-icon mode={this.mode} icon={searchIcon} lazy={false} class="searchbar-search-icon"></ion-icon>

        <button
          type="button"
          no-blur
          class="searchbar-clear-button"
          onMouseDown={this.clearInput.bind(this)}
          onTouchStart={this.clearInput.bind(this)}
        >
          <ion-icon mode={this.mode} icon={clearIcon} lazy={false} class="searchbar-clear-icon"></ion-icon>
        </button>
      </div>,
      this.mode === 'ios' && cancelButton
    ];
  }
}
