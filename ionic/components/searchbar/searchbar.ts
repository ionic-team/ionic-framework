import {ElementRef, Component, Directive, Host, HostBinding, HostListener, ViewChild, Input, Output, EventEmitter} from 'angular2/core';
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
  @HostListener('input', ['$event'])
  /**
   * @private
   * Update the Searchbar input value when the input changes
   */
  private inputChanged(ev) {
    ev.preventDefault();
  }

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
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
 * <ion-searchbar [(ngModel)]="defaultSearch" (input)="triggerInput($event)" (cancel)="onCancelSearchbar($event)" (clear)="onClearSearchbar($event)"></ion-searchbar>
 * ```
 *
 * @property {string} [cancelButtonText=Cancel] - Sets the cancel button text to the value passed in
 * @property {boolean} [hideCancelButton=false] - Hides the cancel button
 * @property {string} [placeholder=Search] - Sets input placeholder to the value passed in
 *
 * @property {Any} [input] - Expression to evaluate when the Searchbar input has changed
 * @property {Any} [cancel] - Expression to evaluate when the cancel button is clicked.
 * @property {Any} [clear] - Expression to evaluate when the clear input button is clicked.
 *
 * @see {@link /docs/v2/components#search Search Component Docs}
 */
@Component({
  selector: 'ion-searchbar',
  template:
    '<div class="searchbar-input-container">' +
      '<button (click)="cancelSearchbar()" (mousedown)="cancelSearchbar()" clear dark class="searchbar-md-cancel">' +
        '<icon arrow-back></icon>' +
      '</button>' +
      '<div class="searchbar-search-icon"></div>' +
      '<input [value]="value" (keyup)="inputChanged($event)" (blur)="inputBlurred()" (focus)="inputFocused()" class="searchbar-input" type="search" [attr.placeholder]="placeholder">' +
      '<button clear *ngIf="value" class="searchbar-clear-icon" (click)="clearInput()" (mousedown)="clearInput()"></button>' +
    '</div>' +
    '<button clear (click)="cancelSearchbar()" (mousedown)="cancelSearchbar()" [hidden]="hideCancelButton" class="searchbar-ios-cancel">{{cancelButtonText}}</button>',
  directives: [FORM_DIRECTIVES, NgIf, NgClass, Icon, Button, SearchbarInput]
})
export class Searchbar extends Ion {
  @ViewChild(SearchbarInput) searchbarInput;

  @Input() cancelButtonText: string;
  @Input() hideCancelButton: any;
  @Input() placeholder: string;
  @Input() ngModel: any;

  @Output() input: EventEmitter<Searchbar> = new EventEmitter();
  @Output() cancel: EventEmitter<Searchbar> = new EventEmitter();
  @Output() clear: EventEmitter<Searchbar> = new EventEmitter();

  value: string = '';
  blurInput = true;

  @HostBinding('class.searchbar-focused') isFocused;

  @HostBinding('class.searchbar-left-aligned') shouldLeftAlign;

  @HostListener('keyup', ['$event'])
  /**
   * @private
   * Update the Searchbar input value when the input changes
   */
  private inputChanged(ev) {
    this.value = ev.target.value;
    this.onChange(this.value);
    this.input.emit(this.value);
  }

  constructor(
    elementRef: ElementRef,
    config: Config,
    ngControl: NgControl
  ) {
    super(elementRef, config);

    if (ngControl) {
      this.ngControl = ngControl;
      this.ngControl.valueAccessor = this;
    }
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

    if (this.ngModel) this.value = this.ngModel;
    this.shouldLeftAlign = this.value && this.value.trim() != '';
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
    this.isFocused = false;
    this.shouldLeftAlign = this.value && this.value.trim() != '';
  }

  /**
   * @private
   * Clears the input field and triggers the control change.
   */
  clearInput() {
    this.value = '';
    this.onChange(this.value);
    this.blurInput = false;
    this.clear.emit(this);
  }

  /**
   * @private
   * Clears the input field and tells the input to blur since
   * the clearInput function doesn't want the input to blur
   * then calls the custom cancel function if the user passed one in.
   */
  cancelSearchbar() {
    this.clearInput();
    this.blurInput = true;
    this.cancel.emit(this);
  }
}
