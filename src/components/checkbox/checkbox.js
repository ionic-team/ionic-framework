import {Component, Template, NgElement, PropertySetter} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config'

export let CheckboxConfig = new ComponentConfig('checkbox')

@Component({
  selector: 'ion-checkbox',
  bind: {
    checked: 'checked'
  },
  events: {
    '^click': 'onClick()'
  },
  services: [CheckboxConfig]
})
@Template({
  inline: `
  <div class="item-media media-checkbox">
    <icon class="ion-ios-circle-outline checkbox-off"></icon>
    <icon class="ion-ios-checkmark checkbox-on"></icon>
  </div>

  <div class="item-content">

    <div class="item-label">
      <content></content>
    </div>

  </div>`
})
export class Checkbox {
  constructor(
    configFactory: CheckboxConfig,
    @NgElement() ngElement: NgElement,
    @PropertySetter('attr.role') setAriaRole: Function,
    @PropertySetter('attr.aria-checked') setAriaChecked: Function,
    @PropertySetter('attr.aria-invalid') setAriaInvalid: Function,
    @PropertySetter('attr.aria-disabled') setAriaDisabled: Function
  ) {
    this.domElement = ngElement.domElement
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

