import { Component, ViewEncapsulation } from '@angular/core';
import { PageOne } from '../pages/page-one/page-one';

@Component({
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
    ion-tabs {
      margin-bottom: 20px;
      contain: none;
    }
    `,
    `
    ion-tabs,
    ion-tabs ion-tabbar {
      position: relative;
      top: auto;
      height: auto;
      visibility: visible;
      opacity: 1;
    }
    `
  ]
})
export class AppComponent {
  root = PageOne;
  myBadge: number = 55;
}
