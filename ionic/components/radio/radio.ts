import {ElementRef, Ancestor, NgControl, Renderer} from 'angular2/angular2';

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
    cd: NgControl,
    renderer: Renderer,
    elementRef: ElementRef,
    ionicConfig: IonicConfig
  ) {
    super(elementRef, ionicConfig);
    this.onChange = (_) => {};
    this.onTouched = (_) => {};
    this.renderer = renderer;
    this.elementRef = elementRef;

    cd.valueAccessor = this;

    this.value = "";
    this.list = true;
  }

  registerButton(radioButton) {
    this.buttons.push(radioButton);
    let inputEl = radioButton.input.elementRef.nativeElement;
    if (!inputEl.hasAttribute('name')) {
      radioButton.input.name = this._name;
    }
  }

  //from clicking the label or switching inputs with keyboard
  //view -> model (Control)
  update(input) {
    for (let button of this.buttons) {
      button.input.checked = false;
    }
    input.checked = true;
    this.onChange(input.value);
  }

  // Called by the model (Control) to update the view
  writeValue(value) {
    this.value = value;
    for (let button of this.buttons) {
      button.input.checked = button.input.value == value;
    }
  }

  // Used by the view to update the model (Control)
  // Up to us to call it in update()
  registerOnChange(fn) { this.onChange = fn; }

  registerOnTouched(fn) { this.onTouched = fn; }
}

@IonicComponent({
  selector: 'ion-radio',
  host: {
    '[class.item]': 'item',
    '[class.active]': 'input.checked',
    '[attr.aria-checked]': 'input.checked',
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
    this.group.registerButton(this);
  }

  //from clicking the label or switching inputs with keyboard
  //view -> model (Control)
  toggle() {
    this.group.update(this.input);
  }
}
