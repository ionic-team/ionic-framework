import {Directive, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import * as dom  from '../../util/dom';


let inputRegistry = [];
let itemRegistry = [];
let inputItemIds = -1;
let activeInput = null;
let lastInput = null;


// Input element (not the container)
export class IonInput {
  constructor(
    elementRef: ElementRef,
    app: IonicApp,
    config: IonicConfig,
    scrollView: Content
  ) {
    this.elementRef = elementRef;
    this.app = app;
    this.scrollView = scrollView;

    this.scrollAssist = config.setting('keyboardScrollAssist');

    inputRegistry.push(this);
  }

  hasFocus() {
    return dom.hasFocus(this.elementRef);
  }

  focus() {
    this.setFocus();
  }

  setFocus() {
    // TODO: How do you do this w/ NG2?
    this.elementRef.nativeElement.focus();
  }

  setFocusHolder(type) {
    let focusHolder = this.app.focusHolder();
    focusHolder && focusHolder.setFocusHolder(type);
  }

  isActiveInput(shouldBeActive) {
    if (shouldBeActive) {
      if (activeInput && activeInput !== lastInput) {
        lastInput = activeInput;
      }

      activeInput = this;

      let focusHolder = this.app.focusHolder();
      focusHolder && focusHolder.setActiveInput(activeInput);

    } else if (activeInput === this) {
      lastInput = activeInput;
      activeInput = null;
    }
  }

  sibling(inc) {
    let index = inputRegistry.indexOf(this);
    if (index > -1) {
      return inputRegistry[index + inc];
    }
  }

  static focusPrevious() {
    this.focusMove(-1);
  }

  static focusNext() {
    this.focusMove(1);
  }

  static focusMove(inc) {
    let input = activeInput || lastInput;
    if (input) {
      let siblingInput = input.sibling(inc);
      siblingInput && siblingInput.focus();
    }
  }

  static clearTabIndexes() {
    for (let i = 0; i < inputRegistry.length; i++) {
      inputRegistry[i].tabIndex = -1;
    }
  }

}


// Container element for the label and input element
export class IonInputItem extends Ion {

  constructor(
    elementRef: ElementRef,
    ionicConfig: IonicConfig
  ) {
    super(elementRef, ionicConfig);
    this.id = ++inputItemIds;
    itemRegistry.push(this);
  }

  onInit() {
    super.onInit();
    if (this.input && this.label) {
      this.input.id = (this.input.id || 'input-' + this.id);
      this.label.labelFor = this.input.id;
    }
  }

  registerInput(input) {
    this.input = input;
  }

  registerLabel(label) {
    this.label = label;
  }
}
