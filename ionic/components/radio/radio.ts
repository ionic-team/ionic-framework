import {ElementRef, Ancestor} from 'angular2/angular2';

import {IonicDirective, IonicComponent, IonicView} from '../../config/annotations';
import {IonicConfig} from '../../config/config';
import {Ion} from '../ion';
import {IonInputItem} from '../form/form';

let groupName = -1;

@IonicDirective({
  selector: 'ion-radio-group',
  host: {
    '[class.list]': 'list'
  }
})
export class RadioGroup extends Ion {

  _name: number = ++groupName;
  buttons: Array<RadioButton> = [];

  constructor(
    elementRef: ElementRef,
    ionicConfig: IonicConfig
  ) {
    super(elementRef, ionicConfig);
    this.list = true;
  }

  register(radioButton) {
    this.buttons.push(radioButton);
    let inputEl = radioButton.input.elementRef.nativeElement;
    if (!inputEl.hasAttribute('name')) {
      radioButton.input.name = this._name;
    }
    // if (radioButton && !radioButton.hasAttribute('name')){
    //   radioButton.setAttribute('name', this._name);
    // }
  }

  update(input) {
    for (let button of this.buttons) {
      button.input.checked = button.input.elementRef.nativeElement.checked;
    }
  }

}

@IonicComponent({
  selector: 'ion-radio',
  host: {
    '[class.item]': 'item',
    '[class.active]': 'input.checked',
    '[attr.aria-checked]': 'input.checked',
    '(^click)': 'onClick($event)'
  },
  defaultProperties: {
    'iconOff': 'ion-ios-circle-outline',
    'iconOn': 'ion-ios-checkmark'
  }
})
@IonicView({
  template:
  '<div class="item-media media-radio">' +
    '<icon [name]="iconOff" class="radio-off"></icon>' +
    '<icon [name]="iconOn" class="radio-on"></icon>' +
  '</div>' +
  '<div class="item-content">' +
    '<content></content>' +
  '</div>'
})
export class RadioButton extends IonInputItem {
  constructor(
    @Ancestor() group: RadioGroup,
    elementRef: ElementRef,
    config: IonicConfig
  ) {
    super(elementRef, config);
    this.item = true;
    this.group = group;
  }

  registerInput(input) {
    this.input = input;
    this.group.register(this);
  }

  onClick(ev) {
    // switching between radio buttons with arrow keys fires a MouseEvent
    if (ev.target.tagName === "INPUT") return;
    this.input.checked = !this.input.checked;

    //let bindings update first
    setTimeout(() => this.group.update(this.input));

    //TODO figure out a way to trigger change on the actual input to trigger
    // form updates

    // this._checkbox.dispatchEvent(e);
    //this._checkboxDir.control.valueAccessor.writeValue(val);
  }

  onChangeEvent(input) {
    this.group.update(input);
  }
}
