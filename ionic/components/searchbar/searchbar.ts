import {ElementRef, Renderer, Component, Directive} from 'angular2/core';
import {Host, HostBinding, HostListener, ViewChild, Input, Output, EventEmitter, Optional} from 'angular2/core';
import {NgIf, NgClass, NgControl, FORM_DIRECTIVES} from 'angular2/common';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {Icon} from '../icon/icon';
import {Button} from '../button/button';


/**
* @private
*/
@Directive({
  selector: '.searchbar-input',
})
export class SearchbarInput {
  @HostListener('keyup', ['$event'])
  /**
   * @private
   * Update the Searchbar input value when the input changes
   */
  private inputChanged(ev) {
    this.writeValue(ev.target.value);
    this.onChange(ev.target.value);
  }

  constructor(
    @Optional ngControl: NgControl,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    this.renderer = renderer;
    this.elementRef = elementRef;

    if (!ngControl) return;

    this.ngControl = ngControl;
    this.ngControl.valueAccessor = this;
  }

  /**
   * @private
   * Write a new value to the element.
   */
  public writeValue(value: any) {
    this.value = value;
  }

  public onChange = (_:any) => {};
  public onTouched = () => {};

  /**
   * @private
   * Set the function to be called when the control receives a change event.
   */
  public registerOnChange(fn:(_:any) => {}):void {
    this.onChange = fn;
  }

  /**
   * @private
   * Set the function to be called when the control receives a touch event.
   */
  public registerOnTouched(fn:() => {}):void {
    this.onTouched = fn;
  }

}


/**
 * @name Searchbar
 * @module ionic
 * @description
 * Manages the display of a Searchbar which can be used to search or filter items.
 *
 * @usage
 * ```html
 * <ion-searchbar [(ngModel)]="defaultSearch" (cancel)="onCancelSearchbar(ev, value)"></ion-searchbar>
 * ```
 *
 * @property {string} [cancelButtonText=Cancel] - Sets the cancel button text to the value passed in
 * @property {boolean} [hideCancelButton=false] - Hides the cancel button
 * @property {string} [placeholder=Search] - Sets input placeholder to the value passed in
 *
 * @property {Any} [input] - Expression to evaluate when the Searchbar input has changed
 * @property {Any} [cancel] - Expression to evaluate when the cancel button is clicked.
 *
 * @see {@link /docs/v2/components#search Search Component Docs}
 */
@Component({
  selector: 'ion-searchbar',
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
  directives: [FORM_DIRECTIVES, NgIf, NgClass, Icon, Button, SearchbarInput]
})
export class Searchbar extends Ion {
  @Input cancelButtonText: string;
  @Input hideCancelButton: any;
  @Input placeholder: string;

  // @Output input: EventEmitter<any> = new EventEmitter();
  @Output cancel: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.searchbar-focused') isFocused;

  @HostBinding('class.searchbar-left-aligned')
  /**
   * @private
   * Check if the Searchbar has a value and left align if so
   */
  private shouldLeftAlign() {
    return this.searchbarInput && this.searchbarInput.value && this.searchbarInput.value.trim() != '';
  }

  @ViewChild(SearchbarInput) searchbarInput;

  query: string = '';
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

    // If there is no control then we shouldn't do anything
    if (!ngControl) return;

    this.ngControl = ngControl;
    this.ngControl.valueAccessor = this;
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
   * Sets the Searchbar to focused and aligned left on input focus.
   */
  inputFocused() {
    this.isFocused = true;
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
    this.isFocused = false;
  }

  /**
   * @private
   * Clears the input field and triggers the control change.
   */
  clearInput() {
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
  cancelSearchbar(ev, value) {
    this.clearInput();
    this.blurInput = true;
    console.log("should cancel");
    this.cancel.next();
  }

    /**
    * @private
    * Updates the value of query
    */
   updateQuery(value) {
     this.query = value;
     this.input.emit();
   }
}
