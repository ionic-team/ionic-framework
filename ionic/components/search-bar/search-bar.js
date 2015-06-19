import {ElementRef, Pipe} from 'angular2/angular2'
import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

//import {ControlGroup, ControlDirective} from 'angular2/forms'

import {IonicComponent} from 'ionic/config/component'


@IonicComponent(SearchBar)
@View({
  template: `
  <div class="search-bar-input-container" [class.left-align]="shouldLeftAlign">
    <div class="search-bar-icon"></div>
    <input (focus)="inputFocused()" (blur)="inputBlurred()"
    (input)="inputChanged($event)" class="search-bar-input" type="search" [attr.placeholder]="placeholder">
  </div>
  <button class="search-bar-cancel">{{ cancelText }}</button>`
})
export class SearchBar {

  static get config() {
    return {
      selector: 'ion-search-bar',
      properties: [
        'list',
        'query'
      ],
      defaultProperties: {
        'cancelText': 'Cancel',
        'placeholder': 'Search'
      }
    }
  }

  constructor(
    elementRef: ElementRef//,
    //cd:ControlDirective
  ) {
    this.domElement = elementRef.domElement;
    // this.controlDirective = cd;
    // cd.valueAccessor = this; //ControlDirective should inject CheckboxControlDirective

    this.query = '';
  }

  onInit() {
    SearchBar.applyConfig(this);
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

