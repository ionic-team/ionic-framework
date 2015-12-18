import {ElementRef, Renderer, Directive, Host, forwardRef, ViewChild, Output, EventEmitter} from 'angular2/core';
import {NgIf, NgClass, NgControl, FORM_DIRECTIVES} from 'angular2/common';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {ConfigComponent} from '../../decorators/config-component';
import {Icon} from '../icon/icon';
import {Button} from '../button/button';

/**
 * @name Searchbar
 * @module ionic
 * @description
 * Manages the display of a Searchbar which can be used to search or filter items.
 *
 * @usage
 * ```html
 * <ion-searchbar [(ngModel)]="defaultSearch"></ion-searchbar>
 * ```
 *
 * @property {function} [cancelButtonAction] - the function that gets called by clicking the cancel button
 * @property {string} [cancelButtonText=Cancel] - sets the cancel button text to the value passed in
 * @property {boolean} [hideCancelButton=false] - Hides the cancel button
 * @property {string} [placeholder=Search] - Sets input placeholder to the value passed in
 *
 * @see {@link /docs/v2/components#search Search Component Docs}
 */
@ConfigComponent({
  selector: 'ion-searchbar',
  inputs: [
    'cancelButtonAction',
    'cancelButtonText',
    'hideCancelButton',
    'placeholder'
  ],
  outputs: ['input'],
  host: {
   '[class.searchbar-left-aligned]': 'shouldLeftAlign',
   '[class.searchbar-focused]': 'isFocused',
  },
  template:
    '<div class="searchbar-input-container">' +
      '<button (click)="cancelSearchbar($event, query)" (mousedown)="cancelSearchbar($event, query)" clear dark class="searchbar-md-cancel">' +
        '<icon arrow-back></icon>' +
      '</button>' +
      '<div class="searchbar-search-icon"></div>' +
      '<input [value]="query" (blur)="inputBlurred($event)" (focus)="inputFocused()" class="searchbar-input" type="search" [attr.placeholder]="placeholder">' +
      '<button clear *ngIf="query" class="searchbar-clear-icon" (click)="clearInput()" (mousedown)="clearInput()"></button>' +
    '</div>' +
    '<button clear (click)="cancelSearchbar($event)" (mousedown)="cancelSearchbar($event)" [hidden]="hideCancelButton" class="searchbar-ios-cancel">{{cancelButtonText}}</button>',
  directives: [FORM_DIRECTIVES, NgIf, NgClass, Icon, Button, forwardRef(() => SearchbarInput)]
})
export class Searchbar extends Ion {
  @ViewChild(forwardRef(() => SearchbarInput)) searchbarInput;
  query: string;
  blurInput = true;

  constructor(
    elementRef: ElementRef,
    config: Config,
    ngControl: NgControl,
    renderer: Renderer
  ) {
    super(elementRef, config);
    this.renderer = renderer;
    this.elementRef = elementRef;

    this.input = new EventEmitter('input');

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
   * After the view has initialized check if the Searchbar has a value
   */
  ngAfterViewInit() {
    this.shouldLeftAlign = this.searchbarInput.value && this.searchbarInput.value.trim() != '';
  }

  /**
   * @private
   * Sets the Searchbar to focused and aligned left on input focus.
   */
  inputFocused() {
    this.isFocused = true;
    this.shouldLeftAlign = true;
  }

  /**
   * @private
   * Sets the Searchbar to not focused and checks if it should align left
   * based on whether there is a value in the searchbar or not.
   */
  inputBlurred() {
    // blurInput determines if it should blur
    // if we are clearing the input we still want to stay focused in the input
    if (this.blurInput == false) {
      this.searchbarInput.elementRef.nativeElement.focus();
      this.blurInput = true;
      return;
    }
    //console.log("Blurring input");
    this.isFocused = false;
    this.shouldLeftAlign = this.searchbarInput.value && this.searchbarInput.value.trim() != '';
  }

  /**
   * @private
   * Clears the input field and triggers the control change.
   */
  clearInput() {
    //console.log("Clearing input");
    this.searchbarInput.writeValue('');
    this.searchbarInput.onChange('');
    this.blurInput = false;
  }

  /**
   * @private
   * Clears the input field and tells the input to blur since
   * the clearInput function doesn't want the input to blur
   * then calls the custom cancel function if the user passed one in.
   */
  cancelSearchbar(event, value) {
    //console.log("Cancel searchbar");
    this.clearInput();
    this.blurInput = true;

    this.cancelButtonAction && this.cancelButtonAction(event, value);
  }

    /**
    * @private
    * Updates the value of query
    */
   updateQuery(value) {
     this.query = value;
     this.input.next(value);
   }
}

/**
* @private
* Updates the value of query
*/
@Directive({
  selector: '.searchbar-input',
  host: {
    '(keyup)': 'inputChanged($event)'
  }
})
export class SearchbarInput {
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
   * Update the Searchbar input value when the input changes
   */
  inputChanged(event) {
    this.writeValue(event.target.value);
    this.onChange(event.target.value);
  }

}
