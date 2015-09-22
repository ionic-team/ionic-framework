import {ElementRef, Pipe} from 'angular2/angular2';
//import {ControlGroup, ControlDirective} from 'angular2/forms'

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent, IonicView} from '../../config/decorators';

/**
 * TODO
 */
@IonicComponent({
  selector: 'ion-search-bar',
  properties: [
    'list',
    'query'
  ],
  defaultProperties: {
    'cancelText': 'Cancel',
    'placeholder': 'Search'
  }
})
@IonicView({
  template: `
  <div class="search-bar-input-container" [class.left-align]="shouldLeftAlign">
    <div class="search-bar-icon"></div>
    <input (focus)="inputFocused()" (blur)="inputBlurred()"
    (input)="inputChanged($event)" class="search-bar-input" type="search" [attr.placeholder]="placeholder">
  </div>
  <button class="search-bar-cancel">{{cancelText}}</button>`
})
export class SearchBar extends Ion {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   */
  constructor(
    elementRef: ElementRef,
    config: IonicConfig//,
    //cd:ControlDirective
  ) {
    super(elementRef, config);
    // this.controlDirective = cd;
    // cd.valueAccessor = this; //ControlDirective should inject CheckboxControlDirective

    this.query = '';
  }

  /**
   * Much like ngModel, this is called from our valueAccessor for the attached
   * ControlDirective to update the value internally.
   */
  writeValue(value) {
    this.value = value;
  }

  inputChanged(event) {
    this.value = event.target.value;
    console.log('Search changed', this.value);
    // TODO: Better way to do this?
    this.controlDirective._control().updateValue(event.target.value);
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
