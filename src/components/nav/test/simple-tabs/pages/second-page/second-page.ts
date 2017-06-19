import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../..';

@IonicPage({
})
@Component({
  templateUrl: 'second-page.html'
})
export class SecondPage {

  constructor(public nav: NavController, public params: NavParams) {
  }

  goToNextPage() {
    this.nav.push('FourthPage', { userId: '123', name: 'Hans Gruber'});
  }
}
