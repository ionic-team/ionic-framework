import {NgElement, Component, Template} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config';

export let ListConfig = new ComponentConfig('list')

@Component({
  selector: 'ion-list',
  services: [ListConfig]
})
@Template({
  inline: `<content></content>`
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
