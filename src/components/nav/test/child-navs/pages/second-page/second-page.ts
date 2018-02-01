import { Component } from '@angular/core';
import { IonicPage } from '../../../../../..';

@IonicPage()
@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Second Page Comp
      </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <h3>Sub Header Second Page</h3>
    <ion-nav [root]="root"></ion-nav>
  </ion-content>
  `
})
export class SecondPage {
  root = 'ThirdPage';
}
