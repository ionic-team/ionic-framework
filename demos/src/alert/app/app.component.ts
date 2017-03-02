import { Component } from '@angular/core';
import { PageOne } from '../pages/page-one/page-one';

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class AppComponent {
  root = PageOne;
}
