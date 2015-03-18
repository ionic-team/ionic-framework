import {Component, Template} from 'angular2/angular2';
import {Inject} from 'angular2/di';
import {Ion} from '../ion';
import {IonConfigService} from '../../config';

export var TabbarConfig = IonConfigService();

@Component({
  selector: 'ion-tabbar',
  bind: {
    title: 'view-title'
  },
  services: [TabbarConfig]
})
@Template({
  inline: `<button (click)="press()">Tabbar: {{title}}</button>`
})
export class Tabbar extends Ion {
  constructor(
    // Creates a TabbarConfig instance for this specific instance of Tabbar.
    // this instance is created with a cloned version of all the globally
    // set config properties.
    @Inject(TabbarConfig) config
  ) {
    debugger;
    this.$config = config;
    super();
  }
}


