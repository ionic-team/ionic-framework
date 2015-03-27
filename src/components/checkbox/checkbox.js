import {Component, Template, NgElement, PropertySetter} from 'angular2/angular2';
import {ComponentConfig} from 'ionic2/config/component-config';

export let CheckboxConfig = new ComponentConfig('checkbox');

@Component({
  selector: 'ion-checkbox',
  bind: {
    checked: 'checked'
  },
  events: {
    'click': 'onClick'
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

    <div class="item-title">
      <content></content>
    </div>

  </div>`
})
export class Checkbox {
  constructor(
    @PropertySetter('attr.role') setRole: Function,
    @PropertySetter('attr.aria-checked') setChecked: Function,
    @PropertySetter('attr.aria-invalid') setInvalid: Function,
    @PropertySetter('attr.aria-disabled') setDisabled: Function,
    configFactory: CheckboxConfig,
    element: NgElement
  ) {
    this.domElement = element.domElement;
    this.domElement.classList.add('item');
    this.config = configFactory.create(this);

    setRole('checkbox');
    setChecked('true')
    setInvalid('false');
    setDisabled('false');
  }
}

