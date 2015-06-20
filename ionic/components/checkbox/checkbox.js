import {ElementRef} from 'angular2/angular2'

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {View} from 'angular2/src/core/annotations_impl/view';
import {onInit} from 'angular2/angular2';

//pretty sure this has changed in the latest angular
import {ControlDirective} from 'angular2/forms';
import {IonicComponent} from '../../config/component';
import {Icon} from '../icon/icon';


@IonicComponent(Checkbox)
@View({
  template: `
  <div class="item-media media-checkbox">
    <icon [name]="iconOff" class="checkbox-off"></icon>
    <icon [name]="iconOn" class="checkbox-on"></icon>
  </div>

  <div class="item-content">
    <div class="item-label">
      <content></content>
    </div>
  </div>`,
  directives: [Icon]
})
export class Checkbox {

  static get config() {
    return {
      selector: 'ion-checkbox',
      properties: [ 'checked', 'disabled', 'value' ],
      appInjector: [ ControlDirective ],
      hostListeners: {
        '^click': 'onClick($event)'
      },
      hostAttributes: {
        'role': 'checkbox',
        'class': 'item'
      },
      hostProperties: {
        'checked' : 'attr.aria-checked',
        'disabled' : 'attr.aria-disabled',
        'value': 'attr.value'
      },
      defaultProperties: {
        'iconOff': 'ion-ios-circle-outline',
        'iconOn': 'ion-ios-checkmark'
      }
    }
  }

  constructor(
    cd: ControlDirective
  ) {
    this.controlDirective = cd;
    cd.valueAccessor = this;
  }

  onInit() {
    Checkbox.applyConfig(this);
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
    //this.controlDirective._control().updateValue(this._checked);
  }
  get checked() {
    return this._checked
  }
  onClick() {
    this.checked = !this.checked;
  }

}
