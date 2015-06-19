import {ElementRef} from 'angular2/angular2'

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {View} from 'angular2/src/core/annotations_impl/view';

//import {ControlGroup, ControlDirective} from 'angular2/forms';
import {IonicComponent} from '../../config/component';
import {Icon} from '../icon/icon';


@IonicComponent(Checkbox)
@View({
  template: `
  <div class="item-media media-checkbox">
    <icon [name]="timsIcon" class="checkbox-off"></icon>
    <icon class="checkbox-on"></icon>
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
      properties: [
        'checked'
      ],
      hostListeners: {
        '^click': 'onClick($event)'
      },
      hostAttributes: {
        'role': 'checkbox'
      },
      defaultProperties: {
        'iconOff': 'ion-ios-circle-outline',
        'iconOn': 'ion-ios-checkmark'
      }
    }
  }

  constructor(
    elementRef: ElementRef//,
//    cd: ControlDirective
  ) {
    this.domElement = elementRef.domElement
    this.domElement.classList.add('item')

    this.timsIcon = 'hi-tim'

    // this.controlDirective = cd;
    // cd.valueAccessor = this;

    // TODO: This is a hack and not a very good one at that
    // this.domElement.querySelector('.checkbox-off').classList.add(this.config.properties.iconOff.defaults.ios);
    // this.domElement.querySelector('.checkbox-on').classList.add(this.config.properties.iconOn.defaults.ios);
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
