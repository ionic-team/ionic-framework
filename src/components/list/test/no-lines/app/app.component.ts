import { Component } from '@angular/core';
import { PageOne } from '../pages/page-one/page-one';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class AppComponent {
  rootPage = PageOne;
}
