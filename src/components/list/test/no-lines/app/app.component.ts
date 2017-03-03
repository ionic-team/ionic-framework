import { Component } from '@angular/core';
import { E2EPage } from '../pages/e2e-page/e2e-page';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class E2EApp {
  rootPage = E2EPage;
}

