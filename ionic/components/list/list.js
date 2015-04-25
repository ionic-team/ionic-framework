import {NgElement, Component, View} from 'angular2/angular2'
import {ComponentConfig} from 'ionic/config/component-config';

export let ListConfig = new ComponentConfig('list')

@Component({
  selector: 'ion-list',
  injectables: [ListConfig]
})
@View({
  template: `<content></content>`
})
export class List {
  constructor(
    configFactory: ListConfig,
    ngElement: NgElement
  ) {
    this.domElement = ngElement.domElement;
    configFactory.create(this);
  }
}
