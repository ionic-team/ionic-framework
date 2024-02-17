import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, forceUpdate, h } from '@stencil/core';
import { debounceEvent, raf, componentOnReady } from '@utils/helpers';
import { isRTL } from '@utils/rtl';
import { createColorClasses } from '@utils/theme';
import { arrowBackSharp, closeCircle, closeSharp, searchOutline, searchSharp } from 'ionicons/icons';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';
import type { AutocompleteTypes, Color, StyleEventDetail } from '../../interface';

import type { SearchbarChangeEventDetail, SearchbarInputEventDetail } from './searchbar-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of components.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the appearance of components.
 */
@Component({
  tag: 'ion-searchbar',
  styleUrls: {
    ios: 'searchbar.ios.scss',
    md: 'searchbar.md.scss',
    ionic: 'searchbar.md.scss',
  },
  scoped: true,
})
export class Searchbar implements ComponentInterface {
  private nativeInput?: HTMLInputElement;
  private isCancelVisible = false;
  private shouldAlignLeft = true;
  private originalIonInput?: EventEmitter<SearchbarInputEventDetail>;
  private inputId = `ion-searchbar-${searchbarIds++}`;

  /**
   * The value of the input when the textarea is focused.
   */
  private focusedValue?: string | null;

  @Element() el!: HTMLIonSearchbarElement;

  @State() focused = false;
  @State() noAnimate = true;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * If `true`, enable searchbar animation.
   */
  @Prop() animated = false;

  /**
   * Set the input's autocomplete property.
   */
  @Prop() autocomplete: AutocompleteTypes = 'off';

  /**
   * Set the input's autocorrect property.
   */
  @Prop() autocorrect: 'on' | 'off' = 'off';

  /**
   * Set the cancel button icon. Only applies to `md` mode.
   * Defaults to `arrow-back-sharp`.
   */
  @Prop() cancelButtonIcon = config.get('backButtonIcon', arrowBackSharp) as string;

  /**
   * Set the the cancel button text. Only applies to `ios` mode.
   */
  @Prop() cancelButtonText = 'Cancel';

  /**
   * Set the clear icon. Defaults to `close-circle` for `ios` and `close-sharp` for `md`.
   */
  @Prop() clearIcon?: string;

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
   * If used in a form, set the name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

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
   * The icon to use as the search icon. Defaults to `search-outline` in
   * `ios` mode and `search-sharp` in `md` mode.
   */
  @Prop() searchIcon?: string;

  /**
   * Sets the behavior for the cancel button. Defaults to `"never"`.
   * Setting to `"focus"` shows the cancel button on focus.
   * Setting to `"never"` hides the cancel button.
   * Setting to `"always"` shows the cancel button regardless
   * of focus state.
   */
  @Prop() showCancelButton: 'never' | 'focus' | 'always' = 'never';

  /**
   * Sets the behavior for the clear button. Defaults to `"focus"`.
   * Setting to `"focus"` shows the clear button on focus if the
   * input is not empty.
   * Setting to `"never"` hides the clear button.
   * Setting to `"always"` shows the clear button regardless
   * of focus state, but only if the input is not empty.
   */
  @Prop() showClearButton: 'never' | 'focus' | 'always' = 'always';

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
   * Emitted when the `value` of the `ion-searchbar` element has changed.
   */
  @Event() ionInput!: EventEmitter<SearchbarInputEventDetail>;

  /**
   * The `ionChange` event is fired for `<ion-searchbar>` elements when the user
   * modifies the element's value. Unlike the `ionInput` event, the `ionChange`
   * event is not necessarily fired for each alteration to an element's value.
   *
   * The `ionChange` event is fired when the value has been committed
   * by the user. This can happen when the element loses focus or
   * when the "Enter" key is pressed. `ionChange` can also fire
   * when clicking the clear or cancel buttons.
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

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @Watch('value')
  protected valueChanged() {
    const inputEl = this.nativeInput;
    const value = this.getValue();
    if (inputEl && inputEl.value !== value) {
      inputEl.value = value;
    }
  }

  @Watch('showCancelButton')
  protected showCancelButtonChanged() {
    requestAnimationFrame(() => {
      this.positionElements();
      forceUpdate(this);
    });
  }

  connectedCallback() {
    this.emitStyle();
  }

  componentDidLoad() {
    this.originalIonInput = this.ionInput;
    this.positionElements();
    this.debounceChanged();

    setTimeout(() => {
      this.noAnimate = false;
    }, 300);
  }

  private emitStyle() {
    this.ionStyle.emit({
      searchbar: true,
    });
  }

  /**
   * Sets focus on the native `input` in `ion-searchbar`. Use this method instead of the global
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
    this.ionInput.emit({ value, event });
  }

  /**
   * Clears the input field and triggers the control change.
   */
  private onClearInput = async (shouldFocus?: boolean) => {
    this.ionClear.emit();

    return new Promise<void>((resolve) => {
      // setTimeout() fixes https://github.com/ionic-team/ionic/issues/7527
      // wait for 4 frames
      setTimeout(() => {
        const value = this.getValue();
        if (value !== '') {
          this.value = '';
          this.emitInputChange();

          /**
           * When tapping clear button
           * ensure input is focused after
           * clearing input so users
           * can quickly start typing.
           */
          if (shouldFocus && !this.focused) {
            this.setFocus();

            /**
             * The setFocus call above will clear focusedValue,
             * but ionChange will never have gotten a chance to
             * fire. Manually revert focusedValue so onBlur can
             * compare against what was in the box before the clear.
             */
            this.focusedValue = value;
          }
        }

        resolve();
      }, 16 * 4);
    });
  };

  /**
   * Clears the input field and tells the input to blur since
   * the clearInput function doesn't want the input to blur
   * then calls the custom cancel function if the user passed one in.
   */
  private onCancelSearchbar = async (ev?: Event) => {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.ionCancel.emit();

    // get cached values before clearing the input
    const value = this.getValue();
    const focused = this.focused;

    await this.onClearInput();

    /**
     * If there used to be something in the box, and we weren't focused
     * beforehand (meaning no blur fired that would already handle this),
     * manually fire ionChange.
     */
    if (value && !focused) {
      this.emitValueChange(ev);
    }

    if (this.nativeInput) {
      this.nativeInput.blur();
    }
  };

  /**
   * Update the Searchbar input value when the input changes
   */
  private onInput = (ev: InputEvent | Event) => {
    const input = ev.target as HTMLInputElement | null;
    if (input) {
      this.value = input.value;
    }
    this.emitInputChange(ev);
  };

  private onChange = (ev: Event) => {
    this.emitValueChange(ev);
  };

  /**
   * Sets the Searchbar to not focused and checks if it should align left
   * based on whether there is a value in the searchbar or not.
   */
  private onBlur = (ev: FocusEvent) => {
    this.focused = false;
    this.ionBlur.emit();
    this.positionElements();

    if (this.focusedValue !== this.value) {
      this.emitValueChange(ev);
    }
    this.focusedValue = undefined;
  };

  /**
   * Sets the Searchbar to focused and active on input focus.
   */
  private onFocus = () => {
    this.focused = true;
    this.focusedValue = this.value;
    this.ionFocus.emit();
    this.positionElements();
  };

  /**
   * Positions the input search icon, placeholder, and the cancel button
   * based on the input value and if it is focused. (ios only)
   */
  private positionElements() {
    const value = this.getValue();
    const prevAlignLeft = this.shouldAlignLeft;
    const theme = getIonTheme(this);
    const shouldAlignLeft = !this.animated || value.trim() !== '' || !!this.focused;
    this.shouldAlignLeft = shouldAlignLeft;

    if (theme !== 'ios') {
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
    const rtl = isRTL(this.el);
    const iconEl = (this.el.shadowRoot || this.el).querySelector('.searchbar-search-icon') as HTMLElement;

    if (this.shouldAlignLeft) {
      inputEl.removeAttribute('style');
      iconEl.removeAttribute('style');
    } else {
      // Create a dummy span to get the placeholder width
      const doc = document;
      const tempSpan = doc.createElement('span');
      tempSpan.innerText = this.placeholder || '';
      doc.body.appendChild(tempSpan);

      // Get the width of the span then remove it
      raf(() => {
        const textWidth = tempSpan.offsetWidth;
        tempSpan.remove();

        // Calculate the input padding
        const inputLeft = 'calc(50% - ' + textWidth / 2 + 'px)';

        // Calculate the icon margin
        /**
         * We take the icon width to account
         * for any text scales applied to the icon
         * such as Dynamic Type on iOS as well as 8px
         * of padding.
         */
        const iconLeft = 'calc(50% - ' + (textWidth / 2 + iconEl.clientWidth + 8) + 'px)';

        // Set the input padding start and icon margin start
        if (rtl) {
          inputEl.style.paddingRight = inputLeft;
          iconEl.style.marginRight = iconLeft;
        } else {
          inputEl.style.paddingLeft = inputLeft;
          iconEl.style.marginLeft = iconLeft;
        }
      });
    }
  }

  /**
   * Show the iOS Cancel button on focus, hide it offscreen otherwise
   */
  private positionCancelButton() {
    const rtl = isRTL(this.el);
    const cancelButton = (this.el.shadowRoot || this.el).querySelector('.searchbar-cancel-button') as HTMLElement;
    const shouldShowCancel = this.shouldShowCancelButton();

    if (cancelButton !== null && shouldShowCancel !== this.isCancelVisible) {
      const cancelStyle = cancelButton.style;
      this.isCancelVisible = shouldShowCancel;
      if (shouldShowCancel) {
        if (rtl) {
          cancelStyle.marginLeft = '0';
        } else {
          cancelStyle.marginRight = '0';
        }
      } else {
        const offset = cancelButton.offsetWidth;
        if (offset > 0) {
          if (rtl) {
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
    if (this.showCancelButton === 'never' || (this.showCancelButton === 'focus' && !this.focused)) {
      return false;
    }

    return true;
  }

  /**
   * Determines whether or not the clear button should be visible onscreen.
   * Clear button should be shown if one of two conditions applies:
   * 1. `showClearButton` is set to `always`.
   * 2. `showClearButton` is set to `focus`, and the searchbar has been focused.
   */
  private shouldShowClearButton(): boolean {
    if (this.showClearButton === 'never' || (this.showClearButton === 'focus' && !this.focused)) {
      return false;
    }

    return true;
  }

  render() {
    const { cancelButtonText } = this;
    const animated = this.animated && config.getBoolean('animated', true);
    const theme = getIonTheme(this);
    const clearIcon = this.clearIcon || (theme === 'ios' ? closeCircle : closeSharp);
    const searchIcon = this.searchIcon || (theme === 'ios' ? searchOutline : searchSharp);
    const shouldShowCancelButton = this.shouldShowCancelButton();

    const cancelButton = this.showCancelButton !== 'never' && (
      <button
        aria-label={cancelButtonText}
        // Screen readers should not announce button if it is not visible on screen
        aria-hidden={shouldShowCancelButton ? undefined : 'true'}
        type="button"
        tabIndex={theme === 'ios' && !shouldShowCancelButton ? -1 : undefined}
        onMouseDown={this.onCancelSearchbar}
        onTouchStart={this.onCancelSearchbar}
        class="searchbar-cancel-button"
      >
        <div aria-hidden="true">
          {theme === 'md' ? (
            // TODO look into the mode/theme
            <ion-icon aria-hidden="true" mode={theme} icon={this.cancelButtonIcon} lazy={false}></ion-icon>
          ) : (
            cancelButtonText
          )}
        </div>
      </button>
    );

    return (
      <Host
        role="search"
        aria-disabled={this.disabled ? 'true' : null}
        class={createColorClasses(this.color, {
          [theme]: true,
          'searchbar-animated': animated,
          'searchbar-disabled': this.disabled,
          'searchbar-no-animate': animated && this.noAnimate,
          'searchbar-has-value': this.hasValue(),
          'searchbar-left-aligned': this.shouldAlignLeft,
          'searchbar-has-focus': this.focused,
          'searchbar-should-show-clear': this.shouldShowClearButton(),
          'searchbar-should-show-cancel': this.shouldShowCancelButton(),
        })}
      >
        <div class="searchbar-input-container">
          <input
            aria-label="search text"
            disabled={this.disabled}
            ref={(el) => (this.nativeInput = el)}
            class="searchbar-input"
            inputMode={this.inputmode}
            enterKeyHint={this.enterkeyhint}
            name={this.name}
            onInput={this.onInput}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            placeholder={this.placeholder}
            type={this.type}
            value={this.getValue()}
            autoComplete={this.autocomplete}
            autoCorrect={this.autocorrect}
            spellcheck={this.spellcheck}
          />

          {theme === 'md' && cancelButton}

          <ion-icon
            aria-hidden="true"
            mode={theme}
            icon={searchIcon}
            lazy={false}
            class="searchbar-search-icon"
          ></ion-icon>

          <button
            aria-label="reset"
            type="button"
            no-blur
            class="searchbar-clear-button"
            onPointerDown={(ev) => {
              /**
               * This prevents mobile browsers from
               * blurring the input when the clear
               * button is activated.
               */
              ev.preventDefault();
            }}
            onClick={() => this.onClearInput(true)}
          >
            <ion-icon
              aria-hidden="true"
              mode={theme}
              icon={clearIcon}
              lazy={false}
              class="searchbar-clear-icon"
            ></ion-icon>
          </button>
        </div>
        {theme === 'ios' && cancelButton}
      </Host>
    );
  }
}

let searchbarIds = 0;
