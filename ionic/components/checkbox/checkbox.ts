import {
  View,
  Directive,
  ElementRef,
  Optional,
  NgControl
} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonInput} from '../form/input';
import {IonicConfig} from '../../config/config';
import {IonicComponent, IonicView} from '../../config/annotations';
import {TapClick} from '../button/button';


@IonicComponent({
  selector: 'ion-checkbox',
  properties: [
    'value',
    'checked',
    'disabled',
    'id'
  ],
  host: {
    'class': 'item',
    'role': 'checkbox',
    '[attr.tab-index]': 'tabIndex',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-labelledby]': 'labelId',
    '(^click)': 'click($event)'
  }
})
@IonicView({
  template:
  '<div class="item-media media-checkbox">' +
    '<div class="checkbox-icon"></div>' +
  '</div>' +
  '<div class="item-content" id="{{labelId}}">' +
    '<ng-content></ng-content>' +
  '</div>'
})
export class Checkbox extends Ion {
  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    @Optional() cd: NgControl,
    tapClick: TapClick
  ) {
    super(elementRef, config);
    this.tapClick = tapClick;
    this.tabIndex = 0;
    this.id = IonInput.nextId();

    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    this.cd = cd;

    if (cd) cd.valueAccessor = this;
  }

  onInit() {
    super.onInit();
    this.labelId = 'label-' + this.id;
  }

  toggle() {
    this.checked = !this.checked;
    this.onChange(this.checked);
  }

  click(ev) {
    if (this.tapClick.allowClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      this.toggle();
    }
  }

  writeValue(value) {
    this.checked = value;
  }

  // Used by the view to update the model (Control)
  // Up to us to call it in update()
  registerOnChange(fn) { this.onChange = fn; }

  registerOnTouched(fn) { this.onTouched = fn; }
}
