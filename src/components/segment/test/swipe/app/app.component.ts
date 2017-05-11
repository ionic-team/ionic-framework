import { Component } from '@angular/core';
import {E2EPage} from '../pages/e2e-page/e2e-page';
@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class AppComponent {
  root = E2EPage;
}
