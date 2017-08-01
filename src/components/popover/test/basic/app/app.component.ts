import { Component, ViewEncapsulation } from '@angular/core';
import { PageOne } from '../pages/page-one/page-one';

@Component({
  template: '<ion-nav [root]="root"></ion-nav>',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  root = PageOne;
}
