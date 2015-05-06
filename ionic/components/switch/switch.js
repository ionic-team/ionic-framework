import {Component, View, NgElement} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'


@Component({
  selector: 'ion-switch',
  properties: {
    checked: 'checked'
  },
  events: {
    'click': 'onClick()'
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

    setAriaRole('checkbox')
    setInvalid('false')
    setDisabled('false')

    this.setChecked = setChecked
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
