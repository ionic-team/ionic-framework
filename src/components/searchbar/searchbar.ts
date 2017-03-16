import { Component, ElementRef, EventEmitter, HostBinding, Input, Optional, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl }  from '@angular/forms';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { isPresent, isTrueProperty } from '../../util/util';
import { Platform } from '../../platform/platform';
import { TimeoutDebouncer } from '../../util/debouncer';


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
 * @demo /docs/v2/demos/src/searchbar/
 * @see {@link /docs/v2/components#searchbar Searchbar Component Docs}
 */
@Component({
  selector: 'ion-searchbar',
  template:
    '<div class="searchbar-input-container">' +
      '<button ion-button mode="md" (click)="cancelSearchbar($event)" (mousedown)="cancelSearchbar($event)" clear color="dark" class="searchbar-md-cancel" type="button">' +
        '<ion-icon name="md-arrow-back"></ion-icon>' +
      '</button>' +
      '<div #searchbarIcon class="searchbar-search-icon"></div>' +
      '<input #searchbarInput class="searchbar-input" (input)="inputChanged($event)" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" ' +
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
    '[class.searchbar-left-aligned]': '_shouldAlignLeft'
  },
  encapsulation: ViewEncapsulation.None
})
export class Searchbar extends Ion {
  _value: string|number = '';
  _shouldBlur: boolean = true;
  _shouldAlignLeft: boolean = true;
  _isCancelVisible: boolean = false;
  _spellcheck: boolean = false;
  _autocomplete: string = 'off';
  _autocorrect: string = 'off';
  _isActive: boolean = false;
  _debouncer: TimeoutDebouncer = new TimeoutDebouncer(250);
  _showCancelButton: boolean = false;
  _animated: boolean = false;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/v2/theming/theming-your-app).
   */
  @Input()
  set color(val: string) {
    this._setColor( val);
  }

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"`, `"md"`, or `"wp"`.
   * For more information, see [Platform Styles](/docs/v2/theming/platform-specific-styles).
   */
  @Input()
  set mode(val: string) {
    this._setMode( val);
  }

  /**
   * @input {string} Set the the cancel button text. Default: `"Cancel"`.
   */
  @Input() cancelButtonText: string = 'Cancel';

  /**
   * @input {boolean} If true, show the cancel button.
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
   * @input {boolean} If true, enable searchbar animation.
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
   * @output {event} Emitted when the Searchbar input has blurred.
   */
  @Output() ionBlur: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  /**
   * @output {event} Emitted when the Searchbar input has focused.
   */
  @Output() ionFocus: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  /**
   * @output {event} Emitted when the cancel button is clicked.
   */
  @Output() ionCancel: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  /**
   * @output {event} Emitted when the clear input button is clicked.
   */
  @Output() ionClear: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  /**
   * @private
   */
  @HostBinding('class.searchbar-has-focus') _sbHasFocus: boolean;

  constructor(
    config: Config,
    private _plt: Platform,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() ngControl: NgControl
  ) {
    super(config, elementRef, renderer, 'searchbar');

    // If the user passed a ngControl we need to set the valueAccessor
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  @ViewChild('searchbarInput') _searchbarInput: ElementRef;

  @ViewChild('searchbarIcon') _searchbarIcon: ElementRef;

  @ViewChild('cancelButton', {read: ElementRef}) _cancelButton: ElementRef;

  /**
   * @input {string} Set the input value.
   */
  @Input()
  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    if (this._searchbarInput) {
      let ele = this._searchbarInput.nativeElement;
      if (ele) {
        ele.value = val;
      }
    }
  }

  /**
   * @private
   * On Initialization check for attributes
   */
  ngOnInit() {
    let showCancelButton = this.showCancelButton;
    if (typeof showCancelButton === 'string') {
      this.showCancelButton = (showCancelButton === '' || showCancelButton === 'true');
    }
  }

  /**
   * @private
   * After View Checked position the elements
   */
  ngAfterContentInit() {
    this.positionElements();
  }

  /**
   * @private
   * Positions the input search icon, placeholder, and the cancel button
   * based on the input value and if it is focused. (ios only)
   */
  positionElements() {
    let isAnimated = this._animated;
    let prevAlignLeft = this._shouldAlignLeft;
    let shouldAlignLeft = (!isAnimated || (this._value && this._value.toString().trim() !== '') || this._sbHasFocus === true);
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
    if (!this._searchbarInput || !this._searchbarIcon) {
      return;
    }
    let inputEle = this._searchbarInput.nativeElement;
    let iconEle = this._searchbarIcon.nativeElement;

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

      // Set the input padding left
      var inputLeft = 'calc(50% - ' + (textWidth / 2) + 'px)';
      inputEle.style.paddingLeft = inputLeft;

      // Set the icon margin left
      var iconLeft = 'calc(50% - ' + ((textWidth / 2) + 30) + 'px)';
      iconEle.style.marginLeft = iconLeft;
    }
  }

  /**
   * @private
   * Show the iOS Cancel button on focus, hide it offscreen otherwise
   */
  positionCancelButton() {
    if (!this._cancelButton || !this._cancelButton.nativeElement) {
      return;
    }
    let showShowCancel = this._sbHasFocus;
    if (showShowCancel !== this._isCancelVisible) {
      let cancelStyleEle = this._cancelButton.nativeElement;
      let cancelStyle = cancelStyleEle.style;
      this._isCancelVisible = showShowCancel;
      if (showShowCancel) {
        cancelStyle.marginRight = '0';
      } else {
        let offset = cancelStyleEle.offsetWidth;
        if (offset > 0) {
          cancelStyle.marginRight = -offset + 'px';
        }
      }
    }
  }


  /**
   * @private
   * Update the Searchbar input value when the input changes
   */
  inputChanged(ev: any) {
    this._value = ev.target.value;
    this._debouncer.debounce(() => {
      this.onChange(this._value);
      this.ionInput.emit(ev);
    });
  }

  /**
   * @private
   * Sets the Searchbar to focused and active on input focus.
   */
  inputFocused(ev: UIEvent) {
    this.ionFocus.emit(ev);

    this._sbHasFocus = true;
    this._isActive = true;
    this.positionElements();
  }

  /**
   * @private
   * Sets the Searchbar to not focused and checks if it should align left
   * based on whether there is a value in the searchbar or not.
   */
  inputBlurred(ev: UIEvent) {
    // _shouldBlur determines if it should blur
    // if we are clearing the input we still want to stay focused in the input
    if (this._shouldBlur === false) {
      this._searchbarInput.nativeElement.focus();
      this._shouldBlur = true;
      return;
    }
    this.ionBlur.emit(ev);

    this._sbHasFocus = false;
    this.positionElements();
  }

  /**
   * @private
   * Clears the input field and triggers the control change.
   */
  clearInput(ev: UIEvent) {
    this.ionClear.emit(ev);

    // setTimeout() fixes https://github.com/driftyco/ionic/issues/7527
    // wait for 4 frames
    setTimeout(() => {
      let value = this._value;
      if (isPresent(value) && value !== '') {
        this.value = ''; // DOM WRITE
        this.onChange(this._value);
        this.ionInput.emit(ev);
      }
    }, 16 * 4);
    this._shouldBlur = false;
  }

  /**
   * @private
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

  /**
   * @private
   * Write a new value to the element.
   */
  writeValue(val: any) {
    this.value = val;
    this.positionElements();
  }

  /**
   * @private
   */
  onChange = (_: any) => {};

  /**
   * @private
   */
  onTouched = () => {};

  /**
   * @private
   * Set the function to be called when the control receives a change event.
   */
  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  /**
   * @private
   * Set the function to be called when the control receives a touch event.
   */
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setFocus() {
    this._renderer.invokeElementMethod(this._searchbarInput.nativeElement, 'focus');
  }
}
