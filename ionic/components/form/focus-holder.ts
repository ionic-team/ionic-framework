import {Component, Directive, View, Host, ElementRef, forwardRef} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import * as dom  from '../../util/dom';
import {Platform} from '../../platform/platform';
import {IonInput} from './input';


@Component({
  selector: 'focus-holder'
})
@View({
  template: '<input><input><input>',
  directives: [forwardRef(() => FocusInput)]
})
export class FocusHolder {
  constructor() {
    this.i = [];
  }

  setFocusHolder(inputType) {
    IonInput.clearTabIndexes();

    this.i[1].tabIndex = ACTIVE_TAB_INDEX;
    this.i[1].type = inputType;
    this.i[1].focus();
  }

  setActiveInput(input) {
    IonInput.clearTabIndexes();

    this.i[1].tabIndex = -1;

    input.tabIndex = ACTIVE_TAB_INDEX;
  }

  receivedFocus(tabIndex) {
    if (tabIndex === PREVIOUS_TAB_INDEX) {
      // they tabbed back one input
      // reset the focus to the center focus holder
      this.i[1].focus();

      // focus on the previous input
      IonInput.focusPrevious();

    } else if (tabIndex === NEXT_TAB_INDEX) {
      // they tabbed to the next input
      // reset the focus to the center focus holder
      this.i[1].focus();

      // focus on the next input
      IonInput.focusNext();
    }
  }

  register(input) {
    // register each of the focus holder inputs
    // assign them their correct tab indexes
    input.tabIndex = PREVIOUS_TAB_INDEX + this.i.length;
    this.i.push(input);
  }
}


@Directive({
  selector: 'input',
  properties: [
    'tabIndex'
  ],
  host: {
    '[tabIndex]': 'tabIndex',
    '[type]': 'type',
    '(focus)': 'holder.receivedFocus(tabIndex)',
    '(keydown)': 'keydown($event)'
  }
})
class FocusInput {
  constructor(elementRef: ElementRef, @Host() holder: FocusHolder) {
    this.elementRef = elementRef;
    holder.register(this);
    this.holder = holder;
  }

  focus() {
    this.elementRef.nativeElement.focus();
  }

  keydown(ev) {
    // prevent any keyboard typing when a holder has focus
    if (ev.keyCode !== 9) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  get type() {
    // default to text type if unknown
    return this._t || 'text';
  }

  set type(val) {
    this._t = val;
  }
}

const PREVIOUS_TAB_INDEX = 999;
const ACTIVE_TAB_INDEX = 1000;
const NEXT_TAB_INDEX = 1001;
