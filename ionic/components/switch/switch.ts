import {
  View,
  Directive,
  ElementRef,
  Renderer,
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
  selector: 'ion-switch',
  host: {
    'class': 'item',
    //'[attr.aria-checked]': 'input.checked'
  }
})
@IonicView({
  template:
  '<div class="item-content">' +
    '<content></content>' +
  '</div>' +
  '<div class="item-media media-switch">' +
    '<div class="switch-track">' +
      '<div class="switch-handle"></div>' +
    '</div>' +
  '</div>'
})
export class Switch extends IonInputItem {
  constructor(
    @Optional() cd: NgControl,
    renderer: Renderer,
    elementRef: ElementRef,
    config: IonicConfig
  ) {
    super(elementRef, config);
    this.onChange = (_) => {};
    this.onTouched = (_) => {};
    this.renderer = renderer;
    this.elementRef = elementRef;
    this.cd = cd;

    if(cd) cd.valueAccessor = this;
  }

  onInit() {
    super.onInit();
    console.log("switch onInit")
  }

  onAllChangesDone() {
    return
    console.log("switch onAllChangesDone")
    if (this._checked !== void 0 && this.input.checked != this._checked) {
      if (this.input.checked !== void 0) {
        console.warn("switch checked is set in view template and Control declaration.\n" +
                      "Value: " + !!this._checked + " from Control takes precedence");
      }
      this.input.checked = !!this._checked;
    }
    if (this._value !== void 0 && this.input.value != this._value) {
      if (this.input.value !== void 0) {
        console.warn("switch value is set in view template and Control declaration.\n" +
                      "Value: " + this._value + " from Control takes precedence");
      }
      this.input.value = this._value;
    }
    if (this.input.value === void 0) {
      this.input.value = "on";
    }
    if (this.input.checked === void 0) {
      this.input.checked = false;
    }
    //TODO check validity
    this.cd.control._value = {"checked": !!this.input.checked, "value": this.input.value};

    //TODO only want to call this once, we want to set input.checked directly on subsequent
    // writeValue's
    this.onAllChangesDone = () => {};
    // this.onChange({"checked": this.input.checked, "value": this.input.value});
  }

  //from clicking the label or selecting with keyboard
  //view -> model (Control)
  toggle() {
    this.input.checked = this._checked = !this.input.checked;
    this.onChange({"checked": this.input.checked, "value": this.input.value});
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

    // this.cd.control._value = {"checked": this.input.checked, "value": this.input.value};
  }

  // Used by the view to update the model (Control)
  // Up to us to call it in update()
  registerOnChange(fn) { this.onChange = fn; }

  registerOnTouched(fn) { this.onTouched = fn; }
}
