import { Component, ElementRef, EventEmitter, Input, Optional, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';

import { Config } from '../../config/config';
import { BaseInput } from '../../util/base-input';
import { isPresent, isTrueProperty } from '../../util/util';
import { TimeoutDebouncer } from '../../util/debouncer';
import { Platform } from '../../platform/platform';

/**
 * @name Searchbar
 * @module ionic
 * @description
 * Manages the display of a Searchbar which can be used to search or filter items.
 *
 * @usage
 * ```html
 * <ion-searchbar
 *   [(ngModel)]="myInput"
 *   [showCancelButton]="shouldShowCancel"
 *   (ionInput)="onInput($event)"
 *   (ionCancel)="onCancel($event)">
 * </ion-searchbar>
 * ```
 *
 * @demo /docs/demos/src/searchbar/
 * @see {@link /docs/components#searchbar Searchbar Component Docs}
 */
@Component({
  selector: 'ion-searchbar',
  template:
    '<div class="searchbar-input-container">' +
      '<button ion-button mode="md" (click)="cancelSearchbar($event)" (mousedown)="cancelSearchbar($event)" clear color="dark" class="searchbar-md-cancel" type="button">' +
        '<ion-icon name="md-arrow-back"></ion-icon>' +
      '</button>' +
      '<div #searchbarIcon class="searchbar-search-icon"></div>' +
      '<input #searchbarInput class="searchbar-input" (input)="inputChanged($event)" (blur)="inputBlurred()" (focus)="inputFocused()" ' +
        'dir="auto" ' +
        '[attr.placeholder]="placeholder" ' +
        '[attr.type]="type" ' +
        '[attr.autocomplete]="_autocomplete" ' +
        '[attr.autocorrect]="_autocorrect" ' +
        '[attr.spellcheck]="_spellcheck">' +
      '<button ion-button clear class="searchbar-clear-icon" [mode]="_mode" (click)="clearInput($event)" (mousedown)="clearInput($event)" type="button"></button>' +
    '</div>' +
    '<button ion-button #cancelButton mode="ios" [tabindex]="_isActive ? 1 : -1" clear (click)="cancelSearchbar($event)" (mousedown)="cancelSearchbar($event)" class="searchbar-ios-cancel" type="button">{{cancelButtonText}}</button>',
  host: {
    '[class.searchbar-animated]': '_animated',
    '[class.searchbar-has-value]': '_value',
    '[class.searchbar-active]': '_isActive',
    '[class.searchbar-show-cancel]': '_showCancelButton',
    '[class.searchbar-left-aligned]': '_shouldAlignLeft',
    '[class.searchbar-has-focus]': '_isFocus'
  },
  encapsulation: ViewEncapsulation.None
})
export class Searchbar extends BaseInput<string> {

  _shouldBlur: boolean = true;
  _shouldAlignLeft: boolean = true;
  _isCancelVisible: boolean = false;
  _spellcheck: boolean = false;
  _autocomplete: string = 'off';
  _autocorrect: string = 'off';
  _isActive: boolean = false;
  _showCancelButton: boolean = false;
  _animated: boolean = false;
  _inputDebouncer: TimeoutDebouncer = new TimeoutDebouncer(0);

  /**
   * @input {string} Set the the cancel button text. Default: `"Cancel"`.
   */
  @Input() cancelButtonText: string = 'Cancel';

  /**
   * @input {boolean} If true, show the cancel button. Default `false`.
   */
  @Input()
  get showCancelButton(): boolean {
    return this._showCancelButton;
  }
  set showCancelButton(val: boolean) {
    this._showCancelButton = isTrueProperty(val);
  }

  /**
   * @input {number} How long, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
   */
  @Input()
  get debounce(): number {
    return this._debouncer.wait;
  }
  set debounce(val: number) {
    this._debouncer.wait = val;
    this._inputDebouncer.wait = val;
  }

  /**
   * @input {string} Set the input's placeholder. Default `"Search"`.
   */
  @Input() placeholder: string = 'Search';

  /**
   * @input {string} Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @Input()
  set autocomplete(val: string) {
    this._autocomplete = (val === '' || val === 'on') ? 'on' : this._config.get('autocomplete', 'off');
  }

  /**
   * @input {string} Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @Input()
  set autocorrect(val: string) {
    this._autocorrect = (val === '' || val === 'on') ? 'on' : this._config.get('autocorrect', 'off');
  }

  /**
   * @input {string|boolean} Set the input's spellcheck property. Values: `true`, `false`. Default `false`.
   */
  @Input()
  set spellcheck(val: string | boolean) {
    this._spellcheck = (val === '' || val === 'true' || val === true) ? true : this._config.getBoolean('spellcheck', false);
  }

  /**
   * @input {string} Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
   */
  @Input() type: string = 'search';

  /**
   * @input {boolean} If true, enable searchbar animation. Default `false`.
   */
  @Input()
  get animated(): boolean {
    return this._animated;
  }
  set animated(val: boolean) {
    this._animated = isTrueProperty(val);
  }

  /**
   * @output {event} Emitted when the Searchbar input has changed, including when it's cleared.
   */
  @Output() ionInput: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  /**
   * @output {event} Emitted when the cancel button is clicked.
   */
  @Output() ionCancel: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  /**
   * @output {event} Emitted when the clear input button is clicked.
   */
  @Output() ionClear: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();


  constructor(
    config: Config,
    private _plt: Platform,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() ngControl: NgControl
  ) {
    super(config, elementRef, renderer, 'searchbar', '', null, null, ngControl);
    this.debounce = 250;
  }

  @ViewChild('searchbarInput') _searchbarInput: ElementRef;

  @ViewChild('searchbarIcon') _searchbarIcon: ElementRef;

  @ViewChild('cancelButton', {read: ElementRef}) _cancelButton: ElementRef;

  /**
   * @hidden
   * On Initialization check for attributes
   */
  ngOnInit() {
    const showCancelButton = this.showCancelButton;
    if (typeof showCancelButton === 'string') {
      this.showCancelButton = (showCancelButton === '' || showCancelButton === 'true');
    }
  }

  /**
   * @hidden
   */
  _inputUpdated() {
    const ele = this._searchbarInput.nativeElement;
    const value = this._value;
    // It is important not to re-assign the value if it is the same, because,
    // otherwise, the caret is moved to the end of the input
    if (ele.value !== value) {
      ele.value = value;
    }
    this.positionElements();
  }

  /**
   * @hidden
   * Positions the input search icon, placeholder, and the cancel button
   * based on the input value and if it is focused. (ios only)
   */
  positionElements() {
    const isAnimated = this._animated;
    const prevAlignLeft = this._shouldAlignLeft;
    const shouldAlignLeft = (!isAnimated || (this._value && this._value.toString().trim() !== '') || this._isFocus === true);
    this._shouldAlignLeft = shouldAlignLeft;

    if (this._mode !== 'ios') {
      return;
    }

    if (prevAlignLeft !== shouldAlignLeft) {
      this.positionPlaceholder();
    }
    if (isAnimated) {
      this.positionCancelButton();
    }
  }

  positionPlaceholder() {
    const inputEle = this._searchbarInput.nativeElement;
    const iconEle = this._searchbarIcon.nativeElement;

    if (this._shouldAlignLeft) {
      inputEle.removeAttribute('style');
      iconEle.removeAttribute('style');

    } else {
      // Create a dummy span to get the placeholder width
      var doc = this._plt.doc();
      var tempSpan = doc.createElement('span');
      tempSpan.innerHTML = this.placeholder;
      doc.body.appendChild(tempSpan);

      // Get the width of the span then remove it
      var textWidth = tempSpan.offsetWidth;
      doc.body.removeChild(tempSpan);

      // Set the input padding start
      var inputLeft = 'calc(50% - ' + (textWidth / 2) + 'px)';
      if (this._plt.isRTL) {
        inputEle.style.paddingRight = inputLeft;
      } else {
        inputEle.style.paddingLeft = inputLeft;
      }

      // Set the icon margin start
      var iconLeft = 'calc(50% - ' + ((textWidth / 2) + 30) + 'px)';
      if (this._plt.isRTL) {
        iconEle.style.marginRight = iconLeft;
      } else {
        iconEle.style.marginLeft = iconLeft;
      }
    }
  }

  /**
   * @hidden
   * Show the iOS Cancel button on focus, hide it offscreen otherwise
   */
  positionCancelButton() {
    const showShowCancel = this._isFocus;
    if (showShowCancel !== this._isCancelVisible) {
      var cancelStyleEle = this._cancelButton.nativeElement;
      var cancelStyle = cancelStyleEle.style;
      this._isCancelVisible = showShowCancel;
      if (showShowCancel) {
        if (this._plt.isRTL) {
          cancelStyle.marginLeft = '0';
        } else {
          cancelStyle.marginRight = '0';
        }
      } else {
        var offset = cancelStyleEle.offsetWidth;
        if (offset > 0) {
          if (this._plt.isRTL) {
            cancelStyle.marginLeft = -offset + 'px';
          } else {
            cancelStyle.marginRight = -offset + 'px';
          }
        }
      }
    }
  }


  /**
   * @hidden
   * Update the Searchbar input value when the input changes
   */
  inputChanged(ev: any) {
    this.value = ev.target.value;
    this._inputDebouncer.debounce(() => {
      this.ionInput.emit(ev);
    });
  }

  /**
   * @hidden
   * Sets the Searchbar to focused and active on input focus.
   */
  inputFocused() {
    this._isActive = true;
    this._fireFocus();
    this.positionElements();
  }

  /**
   * @hidden
   * Sets the Searchbar to not focused and checks if it should align left
   * based on whether there is a value in the searchbar or not.
   */
  inputBlurred() {
    // _shouldBlur determines if it should blur
    // if we are clearing the input we still want to stay focused in the input
    if (this._shouldBlur === false) {
      this._searchbarInput.nativeElement.focus();
      this._shouldBlur = true;
      return;
    }
    this._fireBlur();
    this.positionElements();
  }

  /**
   * @hidden
   * Clears the input field and triggers the control change.
   */
  clearInput(ev: UIEvent) {
    this.ionClear.emit(ev);

    // setTimeout() fixes https://github.com/ionic-team/ionic/issues/7527
    // wait for 4 frames
    setTimeout(() => {
      let value = this._value;
      if (isPresent(value) && value !== '') {
        this.value = ''; // DOM WRITE
        this.ionInput.emit(ev);
      }
    }, 16 * 4);
    this._shouldBlur = false;
  }

  /**
   * @hidden
   * Clears the input field and tells the input to blur since
   * the clearInput function doesn't want the input to blur
   * then calls the custom cancel function if the user passed one in.
   */
  cancelSearchbar(ev: UIEvent) {
    this.ionCancel.emit(ev);

    this.clearInput(ev);
    this._shouldBlur = true;
    this._isActive = false;
  }

  setFocus() {
    this._renderer.invokeElementMethod(this._searchbarInput.nativeElement, 'focus');
  }

}
