import {Component, View as NgView, NgElement, PropertySetter} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'


@Component({
  selector: 'ion-switch',
  bind: {
    checked: 'checked'
  },
  events: {
    'click': 'onClick()'
  }
})
@NgView({
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
    element: NgElement,
    @PropertySetter('attr.role') setAriaRole: Function,
    @PropertySetter('attr.aria-checked') setChecked: Function,
    @PropertySetter('attr.aria-invalid') setInvalid: Function,
    @PropertySetter('attr.aria-disabled') setDisabled: Function
  ) {
    this.domElement = element.domElement
    this.config = Switch.config.invoke(this)

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
