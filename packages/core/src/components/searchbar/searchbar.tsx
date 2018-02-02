import { Component, Element, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { debounce } from '../../utils/helpers';


@Component({
  tag: 'ion-searchbar',
  styleUrls: {
    ios: 'searchbar.ios.scss',
    md: 'searchbar.md.scss'
  },
  host: {
    theme: 'searchbar'
  }
})
export class Searchbar {
  private _isCancelVisible = false;
  private _shouldBlur = true;
  private _shouldAlignLeft = true;

  @Element() private el: HTMLElement;

  @State() activated = false;

  @State() focused = false;


  /**
   * Emitted when the Searchbar input has changed, including when it's cleared.
   */
  @Event() ionInput: EventEmitter;

  /**
   * Emitted when the cancel button is clicked.
   */
  @Event() ionCancel: EventEmitter;

  /**
   * Emitted when the clear input button is clicked.
   */
  @Event() ionClear: EventEmitter;

  /**
   * Emitted when the input loses focus.
   */
  @Event() ionBlur: EventEmitter;

  /**
   * Emitted when the input has focus.
   */
  @Event() ionFocus: EventEmitter;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * If true, enable searchbar animation. Default `false`.
   */
  @Prop({ mutable: true }) animated = false;

  /**
   * Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @Prop({ mutable: true }) autocomplete = 'off';

  /**
   * Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @Prop({ mutable: true }) autocorrect = 'off';

  /**
   * Set the the cancel button text. Default: `"Cancel"`.
   */
  @Prop({ mutable: true }) cancelButtonText = 'Cancel';

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
   */
  @Prop({ mutable: true }) debounce = 250;

  @Watch('debounce')
  private debounceInput() {
    this.ionInput.emit = debounce(
      this.ionInput.emit.bind(this.ionInput),
      this.debounce
    );
  }

  /**
   * Set the input's placeholder. Default `"Search"`.
   */
  @Prop({ mutable: true }) placeholder = 'Search';

  /**
   * If true, show the cancel button. Default `false`.
   */
  @Prop({ mutable: true }) showCancelButton = false;

  /**
   * If true, enable spellcheck on the input. Default `false`.
   */
  @Prop({ mutable: true }) spellcheck = false;

  /**
   * Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
   */
  @Prop({ mutable: true }) type = 'search';

  /**
   * the value of the searchbar.
   */
  @Prop({ mutable: true }) value: string;


  componentDidLoad() {
    this.positionElements();
    this.debounceInput();
  }

  /**
   * Clears the input field and triggers the control change.
   */
  clearInput(ev: UIEvent) {
    this.ionClear.emit({event: ev});

    // setTimeout() fixes https://github.com/ionic-team/ionic/issues/7527
    // wait for 4 frames
    setTimeout(() => {
      const value = this.value;
      if (value !== undefined && value !== '') {
        this.value = '';
        this.ionInput.emit({event: ev});
      }
    }, 16 * 4);
    this._shouldBlur = false;
  }

  /**
   * Clears the input field and tells the input to blur since
   * the clearInput function doesn't want the input to blur
   * then calls the custom cancel function if the user passed one in.
   */
  cancelSearchbar(ev: UIEvent) {
    this.ionCancel.emit({event: ev});

    this.clearInput(ev);
    this._shouldBlur = true;
    this.activated = false;
  }

  /**
   * Update the Searchbar input value when the input changes
   */
  inputChanged(ev: any) {
    this.value = ev.target.value;
    this.ionInput.emit(ev);
  }

  inputUpdated() {
    // const inputEl = this.el.querySelector('.searchbar-input') as HTMLInputElment;

    // It is important not to re-assign the value if it is the same, because,
    // otherwise, the caret is moved to the end of the input
    // if (inputEl && inputEl.value !== this.value) {
    //   // inputEl.value = this.value;
    //   this.value = inputEl.value;
    // }

    this.positionElements();
  }

  /**
   * Sets the Searchbar to not focused and checks if it should align left
   * based on whether there is a value in the searchbar or not.
   */
  inputBlurred() {
    const inputEl = this.el.querySelector('.searchbar-input') as HTMLInputElement;

    // _shouldBlur determines if it should blur
    // if we are clearing the input we still want to stay focused in the input
    if (this._shouldBlur === false) {
      inputEl.focus();
      this._shouldBlur = true;
      this.ionBlur.emit({this: this});
      this.inputUpdated();
      return;
    }

    this.focused = false;
    this.positionElements();
  }

  /**
   * Sets the Searchbar to focused and active on input focus.
   */
  inputFocused() {
    this.activated = true;

    this.focused = true;
    this.ionFocus.emit({this: this});
    this.inputUpdated();

    this.positionElements();
  }

  /**
   * Positions the input search icon, placeholder, and the cancel button
   * based on the input value and if it is focused. (ios only)
   */
  positionElements() {
    const prevAlignLeft = this._shouldAlignLeft;
    const _shouldAlignLeft = (!this.animated || (this.value && this.value.toString().trim() !== '') || this.focused === true);
    this._shouldAlignLeft = _shouldAlignLeft;

    if (this.mode !== 'ios') {
      return;
    }

    if (prevAlignLeft !== _shouldAlignLeft) {
      this.positionPlaceholder();
    }

    if (this.animated) {
      this.positionCancelButton();
    }
  }

  /**
   * Positions the input placeholder
   */
  positionPlaceholder() {
    const isRTL = document.dir === 'rtl';
    const inputEl = this.el.querySelector('.searchbar-input') as HTMLInputElement;
    const iconEl = this.el.querySelector('.searchbar-search-icon') as HTMLElement;

    if (this._shouldAlignLeft) {
      inputEl.removeAttribute('style');
      iconEl.removeAttribute('style');

    } else {
      // Create a dummy span to get the placeholder width
      const tempSpan = document.createElement('span');
      tempSpan.innerHTML = this.placeholder;
      document.body.appendChild(tempSpan);

      // Get the width of the span then remove it
      const textWidth = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);

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
  positionCancelButton() {
    const isRTL = document.dir === 'rtl';
    const cancelButton = this.el.querySelector('.searchbar-ios-cancel') as HTMLElement;
    const shouldShowCancel = this.focused;

    if (shouldShowCancel !== this._isCancelVisible) {
      const cancelStyle = cancelButton.style;
      this._isCancelVisible = shouldShowCancel;
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
        'searchbar-active': this.activated,
        'searchbar-animated': this.animated,
        'searchbar-has-value': (this.value !== undefined && this.value !== ''),
        'searchbar-show-cancel': this.showCancelButton,
        'searchbar-left-aligned': this._shouldAlignLeft,
        'searchbar-has-focus': this.focused
      }
    };
  }

  // TODO remove the ion-buttons and replace with native buttons to remove
  // the button dependency
  render() {
    return [
      <div class='searchbar-input-container'>
        <ion-button
          onClick={this.cancelSearchbar.bind(this)}
          onMouseDown={this.cancelSearchbar.bind(this)}
          fill='clear'
          color='dark'
          class='searchbar-md-cancel'>
            <ion-icon name='md-arrow-back'></ion-icon>
        </ion-button>
        <div class='searchbar-search-icon'></div>
        <input
          class='searchbar-input'
          onInput={this.inputChanged.bind(this)}
          onBlur={this.inputBlurred.bind(this)}
          onFocus={this.inputFocused.bind(this)}
          placeholder={this.placeholder}
          type={this.type}
          value={this.value}
          autoComplete={this.autocomplete}
          autoCorrect={this.autocorrect}
          spellCheck={this.spellcheck}/>
        <ion-button
          fill='clear'
          class='searchbar-clear-icon'
          onClick={this.clearInput.bind(this)}
          onMouseDown={this.clearInput.bind(this)}>
        </ion-button>
      </div>,
      <ion-button
        tabindex={this.activated ? 1 : -1}
        fill='clear'
        onClick={this.cancelSearchbar.bind(this)}
        onMouseDown={this.cancelSearchbar.bind(this)}
        class='searchbar-ios-cancel'>
          {this.cancelButtonText}
      </ion-button>
    ];
  }
}
