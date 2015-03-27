import {NgElement, Component, Template} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config';

export let ListConfig = new ComponentConfig('list');

@Component({
  selector: 'ion-list',
  services: [ListConfig]
})
@Template({
  inline: `
    <header class="list-header">
      <content select="ion-list-header"></content>
    </header>
    <div class="list-content">
      <content></content>
    </div>
    <footer class="list-footer">
      <content select="ion-list-footer"></content>
    </footer>
  `
})
export class List {
  constructor(
    configFactory: ListConfig,
    element: NgElement
  ) {
    this.domElement = element.domElement;
    configFactory.create(this);
  }
}
