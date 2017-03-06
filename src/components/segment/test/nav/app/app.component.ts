import { Component } from '@angular/core';
import { FirstPage } from '../pages/first-page/first-page';
@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class E2EApp {
  root = FirstPage;
}
