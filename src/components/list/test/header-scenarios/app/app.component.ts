import { Component } from '@angular/core';

import { E2EPage } from '../pages/main/main';

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class AppComponent {
  root = E2EPage;
}
