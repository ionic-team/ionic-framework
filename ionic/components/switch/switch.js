import {NgElement, Renderer, ElementRef, Component, DefaultValueAccessor, View, Ancestor, Optional, Decorator, Directive} from 'angular2/angular2'
import {ControlGroup, ControlDirective} from 'angular2/forms'
import {dom} from 'ionic/util';
import {IonicComponent} from 'ionic/config/component'
import {Button} from 'ionic/components/button/button'


@Component({
  selector: 'ion-switch',
  properties: {
    checked: 'checked'
  }
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
    @NgElement() element:NgElement
    // @PropertySetter('attr.role') setAriaRole: Function,
    // @PropertySetter('attr.aria-checked') setChecked: Function,
    // @PropertySetter('attr.aria-invalid') setInvalid: Function,
    // @PropertySetter('attr.aria-disabled') setDisabled: Function
  ) {
    this.domElement = element.domElement
    this.config = Switch.config.invoke(this)

    let setAriaRole = (v) => this.domElement.setAttribute('aria-role', v)
    let setAriaChecked = (v) => this.domElement.setAttribute('aria-checked', v)
    let setAriaInvalid = (v) => this.domElement.setAttribute('aria-invalid', v)
    let setAriaDisabled = (v) => this.domElement.setAttribute('aria-disabled', v)

    this.domElement.classList.add('item')

    // TODO: These rely on the commented-out PropertySetter's above
    //setAriaRole('checkbox')
    //setInvalid('false')
    //setDisabled('false')
    //this.setChecked = setChecked
  }

  set checked(checked) {
    this._checked = checked
    this.setChecked(checked)
  }
  get checked() {
    return this._checked
  }
  onClick() {
    this.checked = !this.checked;
  }
}

new IonicComponent(Switch, {})
