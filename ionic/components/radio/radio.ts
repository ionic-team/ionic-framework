import {ElementRef, Ancestor, Optional, NgControl} from 'angular2/angular2';

import {IonicDirective, IonicComponent, IonicView} from '../../config/annotations';
import {IonicConfig} from '../../config/config';
import {Ion} from '../ion';
import {IonInputItem} from '../form/form';
import {TapClick} from '../button/button';


@IonicDirective({
  selector: 'ion-radio-group',
  host: {
    'class': 'list',
    'role': 'radiogroup',
    '[attr.aria-activedescendant]': 'activeId'
  }
})
export class RadioGroup extends Ion {
  radios: Array<RadioButton> = [];

  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    @Optional() cd: NgControl
  ) {
    super(elementRef, config);
    this.id = ++radioGroupIds;
    this.radioIds = -1;
    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    if (cd) cd.valueAccessor = this;
  }

  registerRadio(radio) {
    radio.id = radio.id || ('radio-' + this.id + '-' + (++this.radioIds));
    this.radios.push(radio);

    if (radio.checked) {
      this.value = radio.value;
      this.activeId = radio.id;
    }
  }

  update(checkedRadio) {
    this.value = checkedRadio.value;
    this.activeId = checkedRadio.id;

    for (let radio of this.radios) {
      radio.checked = (radio === checkedRadio);
    }

    this.onChange(this.value);
  }

  writeValue(value) {
    this.value = value;
    for (let radio of this.radios) {
      radio.checked = (radio.value == value);
    }
  }

  // Used by the view to update the model (Control)
  // Up to us to call it in update()
  registerOnChange(fn) { this.onChange = fn; }

  registerOnTouched(fn) { this.onTouched = fn; }
}


@IonicComponent({
  selector: 'ion-radio',
  properties: [
    'value',
    'checked',
    'disabled',
    'id'
  ],
  host: {
    'class': 'item',
    'role': 'radio',
    '[attr.tab-index]': 'tabIndex',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-labelledby]': 'labelId',
    '(^click)': 'click($event)'
  }
})
@IonicView({
  template:
  '<div class="item-content" id="{{labelId}}">' +
    '<ng-content></ng-content>' +
  '</div>' +
  '<div class="item-media media-radio">' +
    '<div class="radio-icon"></div>' +
  '</div>'
})
export class RadioButton extends IonInputItem {
  constructor(
    @Ancestor() @Optional() group: RadioGroup,
    elementRef: ElementRef,
    config: IonicConfig,
    tapClick: TapClick
  ) {
    super(elementRef, config);
    this.tapClick = tapClick;
    this.group = group;
    this.tabIndex = 0;
  }

  onInit() {
    super.onInit();
    this.group.registerRadio(this);
    this.labelId = 'label-' + this.id;
  }

  click(ev) {
    if (this.tapClick.allowClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      this.check();
    }
  }

  check() {
    this.checked = !this.checked;
    this.group.update(this);
  }

}

let radioGroupIds = -1;
