import { Component } from '@angular/core';
import { IonicPage } from '../../../../../..';

@IonicPage()
@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        First Page Comp
      </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <h3>Sub Header First Page</h3>
    <ion-nav [root]="root"></ion-nav>
  </ion-content>
  `
})
export class FirstPage {
  root = 'SecondPage';
}
