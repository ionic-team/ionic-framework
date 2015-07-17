import {
  View,
  Directive,
  ElementRef,
  Optional,
  Parent,
  NgControl
} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonInputItem} from '../form/input';
import {IonicConfig} from '../../config/config';
import {IonicComponent, IonicView} from '../../config/annotations';
import {Icon} from '../icon/icon';


@IonicComponent({
  selector: 'ion-checkbox',
  host: {
    '[class.item]': 'item',
    '[attr.aria-checked]': 'input.checked',
    // '(^click)': 'onClick($event)'
  },
  defaultProperties: {
    'iconOff': 'ion-ios-circle-outline',
    'iconOn': 'ion-ios-checkmark'
  }
})
@IonicView({
  template:
  '<div class="item-media media-checkbox">' +
    '<icon [name]="iconOff" class="checkbox-off"></icon>' +
    '<icon [name]="iconOn" class="checkbox-on"></icon>' +
  '</div>' +
  '<div class="item-content">' +
    '<content></content>' +
  '</div>'
})
export class Checkbox extends IonInputItem {
  constructor(
    elementRef: ElementRef,
    config: IonicConfig
  ) {
    super(elementRef, config);
    this.item = true;
  }

  // onClick(ev) {
  //   debugger
  //   // toggling with spacebar fires mouse event
  //   if (ev.target.tagName === "INPUT") return;
  //
  //   this.input.checked = !this.input.checked;
  //
  //   //TODO trigger change/mouse event on the actual input to trigger
  //   // form updates
  //
  //   // this._checkbox.dispatchEvent(e);
  //   //this._checkboxDir.control.valueAccessor.writeValue(val);
  // }

  onChangeEvent(input) {
    //TODO can we just assume this will always be true?
    this.input.checked = this.input.elementRef.nativeElement.checked;
  }

  focus() {
    let mouseClick = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    this.input && this.input.elementRef.nativeElement.dispatchEvent(mouseClick);
  }
}


// export class CheckboxInput {
//   constructor(
//     elementRef: ElementRef,
//     @Optional() @Parent() container: Checkbox,
//     @Optional() control: NgControl
//   ) {
//     this.elementRef = elementRef;
//     this.control = control ? control : null;
//     container && container.registerCheckbox(this);
//   }
// }
