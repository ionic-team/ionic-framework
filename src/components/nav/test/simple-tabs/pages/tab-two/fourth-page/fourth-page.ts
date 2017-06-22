import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../../..';

@IonicPage({
})
@Component({
  templateUrl: 'fourth-page.html'
})
export class FourthPage {

  constructor(public nav: NavController, public params: NavParams) {
  }

  goToNextPage() {
    this.nav.push('FifthPage', { userId: '456', name: 'Stanley Hudson'});
  }
}
