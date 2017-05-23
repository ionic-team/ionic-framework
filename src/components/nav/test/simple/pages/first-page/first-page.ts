import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'first-page.html'
})
export class FirstPage {
  constructor(public nav: NavController) {
  }

  goToPageTwo() {
    this.nav.push('SecondPage');
  }
}
