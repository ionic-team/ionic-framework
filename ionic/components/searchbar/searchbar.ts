import {ElementRef, Renderer, Directive, Host, forwardRef, ViewChild, Output, EventEmitter} from 'angular2/core';
import {NgIf, NgClass, NgControl, FORM_DIRECTIVES} from 'angular2/common';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {ConfigComponent} from '../../config/decorators';
import {Icon} from '../icon/icon';
import {Button} from '../button/button';

/**
 * @name Searchbar
 * @module ionic
 * @description
 * Manages the display of a search bar which can be used to search or filter items.
 *
 * @usage
 * ```html
 * <ion-searchbar [(ngModel)]="defaultSearch"></ion-searchbar>
 * ```
 *
 * @property [placeholder] - sets input placeholder to value passed in
 * @property [hideCancelButton] - hides the cancel button
 * @property [cancelButtonText] - sets the cancel button text to the value passed in
 * @property [cancelAction] - the function that gets called by clicking the cancel button
 * @see {@link /docs/v2/components#search Search Component Docs}
 */
@ConfigComponent({
  selector: 'ion-searchbar',
  inputs: [
    'cancelAction',
    'hideCancelButton',
    'cancelButtonText',
    'placeholder'
  ],
  host: {
   '[class.searchbar-left-aligned]': 'shouldLeftAlign',
   '[class.searchbar-focused]': 'isFocused',
  },
  template:
    '<div class="searchbar-input-container">' +
      '<button (click)="cancelSearchbar($event, query)" clear dark class="searchbar-md-cancel"><icon arrow-back></icon></button>' +
      '<div class="searchbar-search-icon"></div>' +
      '<input [value]="query" class="searchbar-input" type="search" [attr.placeholder]="placeholder">' +
      '<button clear *ngIf="query" class="searchbar-clear-icon" (click)="clearInput()"></button>' +
    '</div>' +
    '<button clear (click)="cancelSearchbar($event)" [hidden]="hideCancelButton" class="searchbar-ios-cancel">{{cancelButtonText}}</button>',
  directives: [FORM_DIRECTIVES, NgIf, NgClass, Icon, Button, forwardRef(() => SearchbarInput)]
})
export class Searchbar extends Ion {
  @ViewChild(forwardRef(() => SearchbarInput)) searchbarInput;
  query: string;

  constructor(
    elementRef: ElementRef,
    config: Config,
    ngControl: NgControl,
    renderer: Renderer
  ) {
    super(elementRef, config);
    this.renderer = renderer;
    this.elementRef = elementRef;

    // If there is no control then we shouldn't do anything
    if (!ngControl) return;

    this.ngControl = ngControl;
    this.ngControl.valueAccessor = this;

    this.query = '';
  }

  /**
   * @private
   * On Initialization check for attributes
   */
  ngOnInit() {
    let hideCancelButton = this.hideCancelButton;
    if (typeof hideCancelButton === 'string') {
      this.hideCancelButton = (hideCancelButton === '' || hideCancelButton === 'true');
    }

    this.cancelButtonText = this.cancelButtonText || 'Cancel';
    this.placeholder = this.placeholder || 'Search';
  }

  /**
   * @private
   * After the view has initialized check if the searchbar has a value
   */
  ngAfterViewInit() {
    this.shouldLeftAlign = this.searchbarInput.value && this.searchbarInput.value.trim() != '';
  }

  /**
   * @private
   * Sets the searchbar to focused and aligned left on input focus.
   */
  inputFocused() {
    this.isFocused = true;
    this.shouldLeftAlign = true;
  }

  /**
   * @private
   * Sets the searchbar to not focused and checks if it should align left
   * based on whether there is a value in the searchbar or not on input blur.
   */
  inputBlurred() {
    this.isFocused = false;
    this.shouldLeftAlign = this.searchbarInput.value && this.searchbarInput.value.trim() != '';
  }

  /**
   * @private
   * Clears the input field and triggers the control change.
   */
  clearInput() {
    this.searchbarInput.writeValue('');
    this.searchbarInput.onChange('');
  }

  /**
   * @private
   * Blurs the input field, clears the input field and removes the left align
   * then calls the custom cancel function if the user passed one in.
   */
  cancelSearchbar(event, value) {
    this.searchbarInput.elementRef.nativeElement.blur();
    this.clearInput();
    this.shouldLeftAlign = false;

    this.cancelAction && this.cancelAction(event, value);
  }

    /**
    * @private
    * Clears the input field and triggers the control change.
    */
   updateQuery(value) {
     this.query = value;
   }
}

@Directive({
  selector: '.searchbar-input',
  host: {
    '(focus)': 'inputFocused()',
    '(blur)': 'inputBlurred()',
    '(keyup)': 'inputChanged($event)'
  }
})
export class SearchbarInput {
  @Output() input: EventEmitter<any> = new EventEmitter();

  constructor(
    @Host() searchbar: Searchbar,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    this.searchbar = searchbar;
    this.renderer = renderer;
    this.elementRef = elementRef;

    if (!searchbar.ngControl) return;

    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    this.ngControl = searchbar.ngControl;
    this.ngControl.valueAccessor = this;
  }

  ngOnInit() {

  }

  /**
   * @private
   * Write a new value to the element.
   */
  writeValue(value) {
    this.value = value;
    if (typeof value === 'string') {
      this.searchbar.updateQuery(value);
    }
  }

  /**
   * @private
   * Set the function to be called when the control receives a change event.
   */
  registerOnChange(fn) {
    this.onChange = fn;
  }

  /**
   * @private
   * Set the function to be called when the control receives a touch event.
   */
  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  /**
   * @private
   * Sets the Searchbar input to focused and aligned left on input focus.
   */
  inputFocused() {
    this.searchbar.inputFocused();
  }

  inputBlurred() {
    this.searchbar.inputBlurred();
  }

  inputChanged(event) {
    this.writeValue(event.target.value);
    this.onChange(event.target.value);
    this.input.emit(null);
  }

}
