import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../..';

@IonicPage()
@Component({
  template: `
    <ion-nav [root]="root"></ion-nav>
  `
})
export class NestedNavTwoPageOne {

  root: string = 'NestedNavTwoPageTwo';
  constructor(public nav: NavController) {
  }
}
