import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import * as dom  from '../../util/dom';

let inputRegistry = [];
let activeInput = null;
let lastInput = null;
let containerIds = -1;


export class IonInput {
  constructor(
    elementRef: ElementRef,
    app: IonicApp,
    scrollView: Content
  ) {
    this.elementRef = elementRef;
    this.app = app;
    this.scrollView = scrollView;

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


export class IonInputContainer extends Ion {

  constructor(
    elementRef: ElementRef,
    ionicConfig: IonicConfig
  ) {
    super(elementRef, ionicConfig);
    this.id = ++containerIds;
  }

  onInit() {
    if (this.input) {
      this.input.id = 'input-' + this.id;
    }
    if (this.label) {
      this.label.id = 'label-' + this.id;
      this.input.labelledBy = this.label.id;
    }
  }

  registerInput(directive) {
    this.input = directive;
  }

  registerLabel(directive) {
    this.label = directive;
  }

}
