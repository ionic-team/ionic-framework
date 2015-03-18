import {Component, Template} from 'angular2/angular2';
import {Ion} from '../ion';

@Component({
  selector: 'ion-tabbar',
  bind: {
    title: 'view-title'
  }
})
@Template({
  inline: `<button (click)="press()">Tabbar: {{title}}</button>`
})
export class Tabbar extends Ion {
  constructor() {

    // Test that Ion#assign works
    this.assign({
      press: () => {
        alert('pressed!');
      }
    });
  }
}
