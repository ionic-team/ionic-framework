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
  host: {
    'class': 'item',
    'role': 'checkbox',
    '[attr.aria-checked]': 'input.checked',
    '[attr.aria-disabled]': 'input.disabled',
    '[attr.aria-labelledby]': 'labelId',
    '(^click)': 'click($event)'
  }
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
    this.onChange = (_) => {};
    this.onTouched = (_) => {};
    this.tapClick = tapClick;
    this.cd = cd;

    if (cd) cd.valueAccessor = this;
  }

  click(ev) {
    if (this.tapClick.allowClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      this.input.checked = !this.input.checked;
    }
  }

  onInit() {
    super.onInit();
    this.labelId = 'label-' + this.id;
  }

  // Called by the model (Control) to update the view
  writeValue(modelValue) {
    let type = typeof modelValue;
    switch (type) {
      case "boolean":
        // don't set input.value here, do it in onAllChangesDone
        // because they might have set it in the view
        this._checked = modelValue; break;
      case "object":
        if (modelValue.checked !== void 0) this._checked = !!modelValue.checked;
        if (modelValue.value !== void 0) this._value = modelValue.value.toString();
        break;
      default:
        // don't set input.checked here, do it in onAllChangesDone
        // because they might have set it in the view
        this._value = modelValue.toString();
    }

    //TODO we want to set input.checked directly after the first time
    console.log("writeValue, " + this.input.id + " checked: " + this._checked);
    console.log("writeValue " + this.input.id + " value: " + this._value);

  }

  // Used by the view to update the model (Control)
  // Up to us to call it in update()
  registerOnChange(fn) { this.onChange = fn; }

  registerOnTouched(fn) { this.onTouched = fn; }
}
