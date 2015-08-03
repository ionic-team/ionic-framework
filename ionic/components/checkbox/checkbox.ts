import {
  View,
  Directive,
  ElementRef,
  Optional,
  NgControl
} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonInputItem} from '../form/input';
import {IonicConfig} from '../../config/config';
import {IonicComponent, IonicView} from '../../config/annotations';
import {TapClick} from '../button/button';


@IonicComponent({
  selector: 'ion-checkbox',
  properties: [
    'value',
    'checked',
    'disabled'
  ],
  host: {
    'class': 'item',
    'role': 'checkbox',
    '[attr.aria-checked]': 'input.checked',
    '[attr.aria-disabled]': 'input.disabled',
    '[attr.aria-labelledby]': 'labelId',
    '(^click)': 'click($event)'
  },
  exportAs: 'checkbox'
})
@IonicView({
  template:
  '<div class="item-media media-checkbox">' +
    '<input type="checkbox" aria-hidden="true">' +
    '<div class="checkbox-icon"></div>' +
  '</div>' +
  '<div class="item-content" id="{{labelId}}">' +
    '<ng-content></ng-content>' +
  '</div>'
})
export class Checkbox extends IonInputItem {
  constructor(
    @Optional() cd: NgControl,
    elementRef: ElementRef,
    config: IonicConfig,
    tapClick: TapClick
  ) {
    super(elementRef, config);
    this.tapClick = tapClick;

    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    this.cd = cd;

    if (cd) cd.valueAccessor = this;
  }

  onInit() {
    super.onInit();
    this.labelId = 'label-' + this.id;
  }

  onAllChangesDone() {
    this.input.checked = this.checked;
    this.input.disabled = this.disabled;
    this.input.value = this.value;
  }

  toggle() {
    this.input.checked = this.checked = !this.input.checked;
    this.onChange(this.checked);
  }

  click(ev) {
    if (this.tapClick.allowClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      this.toggle();
    }
  }

  // Called by the model (Control) to update the view
  writeValue(modelValue) {
    this.input.checked = modelValue;
  }

  // Used by the view to update the model (Control)
  // Up to us to call it in update()
  registerOnChange(fn) { this.onChange = fn; }

  registerOnTouched(fn) { this.onTouched = fn; }
}
