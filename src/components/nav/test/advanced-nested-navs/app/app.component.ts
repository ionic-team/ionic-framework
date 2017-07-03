import { Component } from '@angular/core';

@Component({
  template: `
<ion-split-pane>
  <ion-nav [root]="rootOne"></ion-nav>
  <ion-nav [root]="rootTwo" main #content></ion-nav>

</ion-split-pane>
  `
})
export class AppComponent {
  rootOne = 'NestedNavOnePageOne';
  rootTwo = 'NestedNavTwoPageOne';
}
