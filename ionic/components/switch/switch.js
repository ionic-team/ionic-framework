import {Renderer, ElementRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {ControlGroup, ControlDirective} from 'angular2/forms'
import {dom} from 'ionic/util';
import {IonicComponent} from 'ionic/config/component'

@Component({
  selector: 'ion-switch',
  properties: {
    checked: 'checked'
  },
  hostListeners: {
    'click': 'switchClicked($event)'
  },
  /*
  TODO: For some reason this triggers a 'TypeError: array.map is not a function'
  events: {
    'click': 'onClick()'
  }
  */
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
export class Switch {
  constructor(
    elementRef: ElementRef,
    cd: ControlDirective
    // @PropertySetter('attr.role') setAriaRole: Function,
    // @PropertySetter('attr.aria-checked') setChecked: Function
    // @PropertySetter('attr.aria-invalid') setInvalid: Function,
    // @PropertySetter('attr.aria-disabled') setDisabled: Function
  ) {
    this.domElement = elementRef.domElement
    this.config = Switch.config.invoke(this)
    this.controlDirective = cd;
    cd.valueAccessor = this;

    // TODO: These are temporary until we figure out what to do
    // with @PropertSetter
    let setAriaRole = (v) => this.domElement.setAttribute('aria-role', v)
    let setAriaChecked = (v) => this.domElement.setAttribute('aria-checked', v)
    let setAriaInvalid = (v) => this.domElement.setAttribute('aria-invalid', v)
    let setAriaDisabled = (v) => this.domElement.setAttribute('aria-disabled', v)

    //let setChecked = (v) => this.domElement.setAttribute('checked', v);

    this.domElement.classList.add('item')

    // TODO: These rely on the commented-out PropertySetter's above
    //setAriaRole('checkbox')
    //setInvalid('false')
    //setDisabled('false')
    this.setCheckedProperty = setAriaChecked
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
    this.setCheckedProperty(checked)
    this.controlDirective._control().updateValue(this._checked);
  }
  get checked() {
    return this._checked
  }
  switchClicked(event) {
    this.checked = !this.checked;
  }
}

new IonicComponent(Switch, {})
