import {Component, View, NgElement, PropertySetter} from 'angular2/angular2'
import {ComponentConfig} from 'ionic/config/component-config'

export let SwitchConfig = new ComponentConfig('switch')

@Component({
  selector: 'ion-switch',
  bind: {
    checked: 'checked'
  },
  events: {
    'click': 'onClick()'
  },
  injectables: [SwitchConfig]
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
    configFactory: SwitchConfig,
    element: NgElement,
    @PropertySetter('attr.role') setAriaRole: Function,
    @PropertySetter('attr.aria-checked') setAriaChecked: Function,
    @PropertySetter('attr.aria-invalid') setAriaInvalid: Function,
    @PropertySetter('attr.aria-disabled') setAriaDisabled: Function
  ) {
    this.domElement = element.domElement
    this.domElement.classList.add('item')
    this.config = configFactory.create(this)

    setAriaRole('checkbox')
    setAriaInvalid('false')
    setAriaDisabled('false')

    this.setAriaRole = setAriaRole
    this.setAriaChecked = setAriaChecked
    this.setAriaInvalid = setAriaInvalid
    this.setAriaDisabled = setAriaDisabled
  }

  set checked(checked) {
    this._checked = checked
    this.setAriaChecked(checked)
  }
  get checked() {
    return this._checked
  }
  onClick() {
    this.checked = !this.checked;
  }
}

