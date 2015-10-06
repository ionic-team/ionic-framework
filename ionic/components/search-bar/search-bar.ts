import {ElementRef, Pipe, NgControl, Renderer} from 'angular2/angular2';
//import {ControlGroup} from 'angular2/forms'

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent, IonicView} from '../../config/decorators';

/**
 * @name Search Bar
 * @description
 * The Search Bar service adds an input field which can be used to search or filter items.
 *
 * @usage
 * ```html
 * <ion-search-bar ng-control="searchQuery"></ion-search-bar>
 * ```
 */
@IonicComponent({
  selector: 'ion-search-bar',
  appInjector: [NgControl],
  properties: [
    'list',
    'query'
  ],
  defaultProperties: {
    'showCancel': false,
    'cancelText': 'Cancel',
    'placeholder': 'Search'
  }
})
@IonicView({
  template: `
  <div class="search-bar-input-container" [class.left-align]="shouldLeftAlign">
    <div class="search-bar-search-icon"></div>
    <input (focus)="inputFocused()" (blur)="inputBlurred()"
    (input)="inputChanged($event)" class="search-bar-input" type="search" [attr.placeholder]="placeholder">
    <div class="search-bar-close-icon"></div>
  </div>
  <button *ng-if="showCancel" class="search-bar-cancel" [class.left-align]="shouldLeftAlign">{{cancelText}}</button>`
})
export class SearchBar extends Ion {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   */
  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    ngControl: NgControl,
    renderer: Renderer
  ) {
    super(elementRef, config);
    this.renderer = renderer;
    this.elementRef = elementRef;
    if(!ngControl) {
      // They don't want to do anything that works, so we won't do anything that breaks
      return;
    }

    this.ngControl = ngControl;

    ngControl.valueAccessor = this;

    this.query = '';
  }

  /**
   * Much like ngModel, this is called from our valueAccessor for the attached
   * ControlDirective to update the value internally.
   */
  writeValue(value) {
    this.value = value;
    console.log('writeValue', value);
    this.renderer.setElementProperty(this.elementRef, 'value', this.value);

  }

  registerOnChange(val) {
    console.log('registerONChange', val);
  }

  registerOnTouched(val) {
    console.log('register on touched', val);
  }

  inputChanged(event) {
    this.value = event.target.value;
    console.log('Search changed', this.value);
    this.ngControl.valueAccessor.writeValue(this.value);
    this.ngControl.control.updateValue(this.value);
    // this.ngControl.valueAccessor.updateValue(this.value);
    // this.ngControl.updateValue(this.value);
    // TODO: Better way to do this?
    //this.controlDirective._control().updateValue(event.target.value);
  }

  inputFocused() {
    this.isFocused = true;
    this.shouldLeftAlign = true;
  }
  inputBlurred() {
    this.isFocused = false;
    this.shouldLeftAlign = this.value.trim() != '';
  }
}

/*
export class SearchPipe extends Pipe {
  constructor() {
    super();
    this.state = 0;
  }

  supports(newValue) {
    return true;
  }

  transform(value, ...args) {
    console.log('Transforming', value, args);
    return value;
    //return `${value} state:${this.state ++}`;
  }

  create(cdRef) {
    console.log('REF', cdRef);
    return new SearchPipe(cdRef);
  }
}
*/
