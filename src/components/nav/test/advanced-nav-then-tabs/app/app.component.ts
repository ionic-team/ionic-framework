import { Component } from '@angular/core';

@Component({
  template: `
<ion-split-pane>
  <ion-nav [root]="rootOne" name="left"></ion-nav>
  <ion-nav [root]="rootTwo" main #content name="right"></ion-nav>

</ion-split-pane>
  `
})
export class AppComponent {
  rootOne = 'NestedNavOnePageTwo';
  rootTwo = 'NestedNavTwoPageTwo';
}
