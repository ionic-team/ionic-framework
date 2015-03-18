import {Component, Template} from 'angular2/angular2';
import {Ion} from '../ion';

@Component({
  selector: 'ion-tabbar',
  bind: {
    title: 'view-title'
  }
})
@Template({
  inline: `<div>Tabbar: {{title}}</div>`
})
export class Tabbar extends Ion {
}
