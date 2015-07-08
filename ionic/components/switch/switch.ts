import {View, ElementRef} from 'angular2/angular2';
import {ControlGroup, ControlDirective} from 'angular2/forms';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';


@IonicComponent({
  selector: 'ion-switch',
  properties: [
    'checked'
  ],
  host: {
    '(click)': 'switchClicked($event)',
    'class': 'item'
  }
})
@View({
  template: `
  <div class="item-content">
    <div class="item-title">
      <content></content>
    </div>
    <div class="item-media media-switch">
      <div class="switch-toggle"></div>
    </div>
  </div>`
})
export class Switch extends Ion {
  constructor(
    elementRef: ElementRef,
    ionicConfig: IonicConfig
    //cd: ControlDirective
  ) {
    super(elementRef, ionicConfig)

    // this.config = Switch.config.invoke(this)
    // this.controlDirective = cd;
    // cd.valueAccessor = this;

    // TODO: These rely on the commented-out PropertySetter's above
    //setAriaRole('checkbox')
    //setInvalid('false')
    //setDisabled('false')
    //this.setCheckedProperty = setAriaChecked
  }

  /**
   * Much like ngModel, this is called from our valueAccessor for the attached
   * ControlDirective to update the value internally.
   */
  writeValue(value) {
    // Convert it to a boolean
    this.checked = !!value;
  }

  set checked(checked) {
    this._checked = checked
    //this.setCheckedProperty(checked)
    this.controlDirective._control().updateValue(this._checked);
  }

  get checked() {
    return this._checked
  }

  switchClicked(ev) {
    this.checked = !this.checked;
  }
}
