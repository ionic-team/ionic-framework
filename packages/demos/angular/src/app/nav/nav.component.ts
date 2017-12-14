import { Component } from '@angular/core';

import { PageOne } from './pages/page-one';

@Component({
  selector: 'app-nav-page',
  template: `
<ion-app>
  <ion-nav [root]="pageOne"></ion-nav>
</ion-app>
  `
})
export class NavPageComponent {

  pageOne: any = PageOne;
  constructor() {

  }

}
