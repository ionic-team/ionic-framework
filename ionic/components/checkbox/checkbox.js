import {Component, View, NgElement, PropertySetter} from 'angular2/angular2'
import {ComponentConfig} from 'ionic/config/component-config'
import {IonicComponent} from 'ionic/config/component'

export let CheckboxConfig = new ComponentConfig('checkbox')

@Component({
  selector: 'ion-checkbox',
  bind: {
    checked: 'checked'
  },
  events: {
    '^click': 'onClick()'
  },
  injectables: [CheckboxConfig]
})
@View({
  template: `
  <div class="item-media media-checkbox">
    <icon class="checkbox-off"></icon>
    <icon class="checkbox-on"></icon>
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

    this.config = Checkbox.config.invoke(this)

    setAriaRole('checkbox')
    setAriaInvalid('false')
    setAriaDisabled('false')

    this.setAriaRole = setAriaRole
    this.setAriaChecked = setAriaChecked
    this.setAriaInvalid = setAriaInvalid
    this.setAriaDisabled = setAriaDisabled

    // TODO: FIXME!! MAKE MORE GOOD!!!!
    this.domElement.querySelector('.checkbox-off').classList.add(this.iconOff)
    this.domElement.querySelector('.checkbox-on').classList.add(this.iconOn)
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

new IonicComponent(Checkbox, {
  bind: {
    iconOff: {
      defaults: {
        ios: 'ion-ios-circle-outline',
        android: 'ion-android-checkbox-outline-blank',
        core: 'ion-android-checkbox-outline-blank'
      }
    },
    iconOn: {
      defaults: {
        ios: 'ion-ios-checkmark',
        android: 'ion-android-checkbox',
        core: 'ion-android-checkbox',
      }
    }
  }
})
