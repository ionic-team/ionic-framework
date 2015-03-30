import {NgElement, Component, Template} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config';

export let RadioConfig = new ComponentConfig('radio');

@Component({
  selector: 'ion-radio-group',
  services: [RadioConfig]
})
@Template({
  inline: `
    <header class="list-header">
      <content select="ion-list-header"></content>
    </header>
    <div class="list-content radio-group radio-group-ios">
      <content></content>
    </div>
    <footer class="list-footer">
      <content select="ion-list-footer"></content>
    </footer>
  `
})
export class RadioGroup {
  constructor(
    configFactory: RadioConfig,
    element: NgElement
  ) {
    this.domElement = element.domElement
    this.domElement.classList.add('list')
    this.domElement.classList.add('list-ios')
    configFactory.create(this)
  }
}
