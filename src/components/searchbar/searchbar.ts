import { Component, ElementRef, EventEmitter, HostBinding, Input, Optional, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl }  from '@angular/forms';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { isPresent } from '../../util/util';
import { Debouncer } from '../../util/debouncer';


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
      '<button ion-button (click)="cancelSearchbar($event)" (mousedown)="cancelSearchbar($event)" clear color="dark" class="searchbar-md-cancel">' +
        '<ion-icon name="arrow-back"></ion-icon>' +
      '</button>' +
      '<div #searchbarIcon class="searchbar-search-icon"></div>' +
      '<input #searchbarInput [(ngModel)]="_value" [attr.placeholder]="placeholder" (input)="inputChanged($event)" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" class="searchbar-input">' +
      '<button ion-button clear class="searchbar-clear-icon" (click)="clearInput($event)" (mousedown)="clearInput($event)"></button>' +
    '</div>' +
    '<button ion-button #cancelButton [tabindex]="_isActive ? 1 : -1" clear (click)="cancelSearchbar($event)" (mousedown)="cancelSearchbar($event)" class="searchbar-ios-cancel">{{cancelButtonText}}</button>',
  host: {
    '[class.searchbar-has-value]': '_value',
    '[class.searchbar-active]': '_isActive',
    '[class.searchbar-show-cancel]': 'showCancelButton',
    '[class.searchbar-left-aligned]': 'shouldAlignLeft()'
  },
  encapsulation: ViewEncapsulation.None
})
export class Searchbar extends Ion {
  _value: string|number = '';
  _shouldBlur: boolean = true;
  _isActive: boolean = false;
  _searchbarInput: ElementRef;
  _debouncer: Debouncer = new Debouncer(250);

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor('searchbar', val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('searchbar', val);
  }

  /**
   * @input {string} Set the the cancel button text. Default: `"Cancel"`.
   */
  @Input() cancelButtonText: string = 'Cancel';

  /**
   * @input {boolean} Whether to show the cancel button or not. Default: `"false"`.
   */
  @Input() showCancelButton: any = false;

  /**
   * @input {number} How long, in milliseconds, to wait to trigger the `input` event after each keystroke. Default `250`.
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
  @Input() autocomplete: string;

  /**
   * @input {string} Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @Input() autocorrect: string;

  /**
   * @input {string|boolean} Set the input's spellcheck property. Values: `true`, `false`. Default `false`.
   */
  @Input() spellcheck: string|boolean;

  /**
   * @input {string} Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
   */
  @Input() type: string = 'search';

  /**
   * @output {event} When the Searchbar input has changed including cleared.
   */
  @Output() ionInput: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  /**
   * @output {event} When the Searchbar input has blurred.
   */
  @Output() ionBlur: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  /**
   * @output {event} When the Searchbar input has focused.
   */
  @Output() ionFocus: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  /**
   * @output {event} When the cancel button is clicked.
   */
  @Output() ionCancel: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  /**
   * @output {event} When the clear input button is clicked.
   */
  @Output() ionClear: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();

  /**
   * @private
   */
  @HostBinding('class.searchbar-has-focus') _sbHasFocus: boolean;

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() ngControl: NgControl
  ) {
    super(config, elementRef, renderer);

    this.mode = config.get('mode');

    // If the user passed a ngControl we need to set the valueAccessor
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /**
   * @private
   */
  @ViewChild('searchbarInput')
  set searchbarInput(searchbarInput: ElementRef) {
    this._searchbarInput = searchbarInput;

    let inputEle = searchbarInput.nativeElement;

    // By defalt set autocomplete="off" unless specified by the input
    let autoComplete = (this.autocomplete === '' || this.autocomplete === 'on') ? 'on' : this._config.get('autocomplete', 'off');
    inputEle.setAttribute('autocomplete', autoComplete);

    // by default set autocorrect="off" unless specified by the input
    let autoCorrect = (this.autocorrect === '' || this.autocorrect === 'on') ? 'on' : this._config.get('autocorrect', 'off');
    inputEle.setAttribute('autocorrect', autoCorrect);

    // by default set spellcheck="false" unless specified by the input
    let spellCheck = (this.spellcheck === '' || this.spellcheck === 'true' || this.spellcheck === true) ? true : this._config.getBoolean('spellcheck', false);
    inputEle.setAttribute('spellcheck', spellCheck);

    // by default set type="search" unless specified by the input
    inputEle.setAttribute('type', this.type);
  }

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
  ngAfterViewChecked() {
    this.positionElements();
  }

  /**
   * @private
   * Positions the input search icon, placeholder, and the cancel button
   * based on the input value and if it is focused. (ios only)
   */
  positionElements() {
    if (this._config.get('mode') !== 'ios') return;

    // Position the input placeholder & search icon
    if (this._searchbarInput && this._searchbarIcon) {
      this.positionInputPlaceholder(this._searchbarInput.nativeElement, this._searchbarIcon.nativeElement);
    }

    // Position the cancel button
    if (this._cancelButton && this._cancelButton.nativeElement) {
      this.positionCancelButton(this._cancelButton.nativeElement);
    }
  }

  /**
   * @private
   * Calculates the amount of padding/margin left for the elements
   * in order to center them based on the placeholder width
   */
  positionInputPlaceholder(inputEle: HTMLElement, iconEle: HTMLElement) {
    if (this.shouldAlignLeft()) {
      inputEle.removeAttribute('style');
      iconEle.removeAttribute('style');
    } else {
      // Create a dummy span to get the placeholder width
      let tempSpan = document.createElement('span');
      tempSpan.innerHTML = this.placeholder;
      document.body.appendChild(tempSpan);

      // Get the width of the span then remove it
      let textWidth = tempSpan.offsetWidth;
      tempSpan.remove();

      // Set the input padding left
      let inputLeft = 'calc(50% - ' + (textWidth / 2) + 'px)';
      inputEle.style.paddingLeft = inputLeft;

      // Set the icon margin left
      let iconLeft = 'calc(50% - ' + ((textWidth / 2) + 30) + 'px)';
      iconEle.style.marginLeft = iconLeft;
    }
  }

  /**
   * @private
   * Show the iOS Cancel button on focus, hide it offscreen otherwise
   */
  positionCancelButton(cancelButtonEle: HTMLElement) {
    if (cancelButtonEle.offsetWidth > 0) {
      if (this._sbHasFocus) {
        cancelButtonEle.style.marginRight = '0';
      } else {
        cancelButtonEle.style.marginRight = -cancelButtonEle.offsetWidth + 'px';
      }
    }
  }

  /**
   * @private
   * Align the input placeholder left on focus or if a value exists
   */
  shouldAlignLeft() {
    return ( (this._value && this._value.toString().trim() !== '') || this._sbHasFocus === true );
  }

  /**
   * @private
   * Update the Searchbar input value when the input changes
   */
  inputChanged(ev: any) {
    let value = ev.target.value;
    this._debouncer.debounce(() => {
      this._value = value;
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

    if (isPresent(this._value) && this._value !== '') {
      this._value = '';
      this.onChange(this._value);
      this.ionInput.emit(ev);
    }

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
    this._value = val;
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
}
