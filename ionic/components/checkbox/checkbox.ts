import {
  View,
  Directive,
  ElementRef,
  Optional,
  Parent,
  NgControl
} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonInputItem} from '../form/form';
import {IonicConfig} from '../../config/config';
import {IonicComponent, IonicView} from '../../config/annotations';
import {Icon} from '../icon/icon';


@IonicComponent({
  selector: 'ion-checkbox',
  host: {
    'class': 'item',
    '[attr.aria-checked]': 'checked'
  },
  defaultProperties: {
    'iconOff': 'ion-ios-circle-outline',
    'iconOn': 'ion-ios-checkmark'
  }
})
@IonicView({
  template:
  '<div class="item-media media-checkbox" (click)="onClick($event)">' +
    '<icon [name]="iconOff" class="checkbox-off"></icon>' +
    '<icon [name]="iconOn" class="checkbox-on"></icon>' +
  '</div>' +
  '<div class="item-content">' +
    '<content></content>' +
  '</div>'
})
export class Checkbox extends IonInputItem {

  _checkbox: CheckboxInput;

  constructor(
    elementRef: ElementRef,
    config: IonicConfig
  ) {
    super(elementRef, config);
  }

  onAllChangesDone() {
    // Enforce that this directive actually contains a checkbox
    if (this._checkbox == null) {
      throw 'No <input type="checkbox"> found inside of <ion-checkbox>';
    }
  }

  registerInput(checkboxDir) {
    if (this._checkbox != null) {
      throw 'Only one <input type="checkbox"> is allowed per <ion-checkbox>'
    }
    this._checkbox = checkboxDir.elementRef.nativeElement;
    this._checkboxDir = checkboxDir;
  }

  onClick(e) {
    let val = !this._checkbox.checked;
    this._checkbox.checked = val;
    this.checked = val;

    //TODO figure out a way to trigger change on the actual input to trigger
    // form updates

    // this._checkbox.dispatchEvent(e);
    //this._checkboxDir.control.valueAccessor.writeValue(val);
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
