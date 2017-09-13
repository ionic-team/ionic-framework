import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../../..';

@IonicPage()
@Component({
  template: `
    <ion-nav [root]="root"></ion-nav>
  `
})
export class NestedNavTwoPageTwo {

  root: string = 'FourthPage';
  constructor(public nav: NavController) {
  }
}
