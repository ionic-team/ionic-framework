import {NgElement, Component, View} from 'angular2/angular2'
import {ComponentConfig} from 'ionic/config/component-config';

export let RadioConfig = new ComponentConfig('radio');

@Component({
  selector: 'ion-radio-group',
  injectables: [RadioConfig]
})
@View({
  template: `<content></content>`
})
export class RadioGroup {
  constructor(
    configFactory: RadioConfig,
    element: NgElement
  ) {
    this.domElement = element.domElement
    this.domElement.classList.add('list')
    this.domElement.classList.add('radio-group')
    configFactory.create(this)
  }
}
