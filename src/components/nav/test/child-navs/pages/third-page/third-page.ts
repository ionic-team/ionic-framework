import { Component } from '@angular/core';

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Third Page Comp
      </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <h3>Sub Header Third Page</h3>
    <ion-nav [root]="root"></ion-nav>
  </ion-content>
  `
})
export class ThirdPage {
  root = 'FourthPage';
}
