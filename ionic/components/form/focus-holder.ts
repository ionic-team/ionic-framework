import {Component, Directive, View, Host, Attribute, ElementRef, forwardRef} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {IonInput} from './input';

/**
 * TODO
 */
@Component({
  selector: 'focus-holder'
})
@View({
  template: '<input tabindex="999"><input tabindex="1001"><input tabindex="1002">',
  directives: [forwardRef(() => FocusInput)]
})
export class FocusHolder {
  /**
   * TODO
   */
  constructor() {
    this.i = [];
  }

  /**
   * TODO
   * @param {TODO} inputType  TODO
   */
  setFocusHolder(inputType) {
    this.i[2].type = inputType;
    this.i[2].setFocus();
  }

  /**
   * TODO
   * @param {TODO} tabIndex  TODO
   */
  receivedFocus(tabIndex) {
    if (tabIndex === '999') {
      // focus on the previous input
      IonInput.focusPrevious();

    } else if (tabIndex === '1001') {
      // focus on the next input
      IonInput.focusNext();
    }
  }

  /**
   * TODO
   * @param {TODO} input  TODO
   */
  register(input) {
    this.i.push(input);
  }
}


@Directive({
  selector: 'input',
  host: {
    '[type]': 'type',
    '(focus)': 'holder.receivedFocus(tabindex)',
    '(keydown)': 'keydown($event)'
  }
})
class FocusInput {
  constructor(
    elementRef: ElementRef,
    @Host() holder: FocusHolder,
    @Attribute('tabindex') tabindex: string
  ) {
    this.elementRef = elementRef;
    this.holder = holder;
    this.tabindex = tabindex;
    this.holder.register(this);
  }

  setFocus() {
    this.elementRef.nativeElement.focus();
  }

  keydown(ev) {
    // prevent any keyboard typing when a holder has focus
    ev.preventDefault();
    ev.stopPropagation();
  }

  get type() {
    // default to text type if unknown
    return this._t || 'text';
  }

  set type(val) {
    this._t = val;
  }
}
