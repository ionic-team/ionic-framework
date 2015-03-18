import {Component, Template} from 'angular2/angular2';
import {Inject} from 'angular2/di';
import {Ion} from '../ion';
import {IonConfigService} from '../../config';

export var TabbarConfig = new IonConfigService();

@Component({
  selector: 'ion-tabbar',
  bind: {
    title: 'view-title'
  },
  services: [TabbarConfig]
})
@Template({
  inline: `<button (click)="press()">
  Tabbar: {{title}} {{$config.id}}
</button>`
})
export class Tabbar extends Ion {
  constructor(
    config: TabbarConfig
  ) {
    this.$config = config;
    super();
  }
}


