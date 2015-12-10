import {ElementRef, Renderer, Directive, Host, forwardRef, ViewChild} from 'angular2/core';
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
 * <ion-searchbar [(ng-model)]="defaultSearch"></ion-searchbar>
 * ```
 *
 * @property [placeholder] - sets input placeholder to value passed in
 * @property [show-cancel] - shows the cancel button based on boolean value passed in
 * @property [cancel-text] - sets the cancel button text to the value passed in
 * @property [cancel-action] - the function that gets called by clicking the cancel button
 * @see {@link /docs/v2/components#search Search Component Docs}
 */
@ConfigComponent({
  selector: 'ion-searchbar',
  defaultInputs: {
    'showCancel': false,
    'cancelText': 'Cancel',
    'placeholder': 'Search'
  },
  inputs: ['cancelAction'],
  host: {
   '[class.searchbar-left-aligned]': 'shouldLeftAlign',
   '[class.searchbar-focused]': 'isFocused',
  },
  template:
    '<div class="searchbar-input-container">' +
      '<button (click)="cancelSearchbar($event, query)" clear dark class="searchbar-md-cancel"><icon arrow-back></icon></button>' +
      '<div class="searchbar-search-icon"></div>' +
      '<input [(value)]="query"' +
      'class="searchbar-input" type="search" [attr.placeholder]="placeholder">' +
      '<button clear *ng-if="query" class="searchbar-clear-icon" (click)="clearInput()"></button>' +
    '</div>' +
    '<button clear *ng-if="showCancel" (click)="cancelSearchbar($event, query)" class="searchbar-ios-cancel">{{cancelText}}</button>',
  directives: [FORM_DIRECTIVES, NgIf, NgClass, Icon, Button, forwardRef(() => SearchbarInput)]
})
export class Searchbar extends Ion {
  @ViewChild(forwardRef(() => SearchbarInput)) searchbarInput;

  /**
   * @private
   * This holds the searchbar input value used for querying
   */
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
  }

  /**
   * @private
   * After the view has initialized check if the searchbar has a value
   * and then store that value in query
   */
  ngAfterViewInit() {
    // If the user passes in a value to the model we should left align
    this.shouldLeftAlign = this.searchbarInput.value && this.searchbarInput.value.trim() != '';
    this.query = this.searchbarInput.value || '';
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
    this.query = '';
  }

  /**
   * @private
   * Blurs the input field, clears the input field and removes the left align
   * then calls the custom cancel function if the user passed one in.
   */
  cancelSearchbar(event, query) {
    this.searchbarInput.elementRef.nativeElement.blur();
    this.clearInput();
    this.shouldLeftAlign = false;

    this.cancelAction && this.cancelAction(event, query);
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
  /**
   * @private
   * This holds the searchbar input value used for querying
   */
  query: string;

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
    if (this.ngControl) this.value = this.ngControl.value;
    console.log(this.value);
  }

  /**
   * @private
   * Write a new value to the element.
   */
  writeValue(value) {
    this.value = value;
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
  }

}
