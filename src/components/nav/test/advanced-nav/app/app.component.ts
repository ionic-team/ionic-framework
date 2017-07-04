import { Component } from '@angular/core';

@Component({
  template: `
<ion-split-pane>
  <ion-nav [root]="root"></ion-nav>
  <ion-nav [root]="root2" main #content></ion-nav>
</ion-split-pane>
  `
})
export class AppComponent {
  root = 'FirstPage';
  root2 = 'FourthPage';
}
