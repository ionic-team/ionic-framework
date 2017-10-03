import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../../..';

@IonicPage({
  segment: 'pageTwo/userId/:userId/name/:name',
  defaultHistory: [
    'FirstPage'
  ]
})
@Component({
  templateUrl: 'second-page.html'
})
export class SecondPage {

  userId: string;
  name: string;
  constructor(public nav: NavController, public params: NavParams) {
  }

  ionViewWillEnter() {
    this.userId = this.params.data.userId;
    this.name = this.params.data.name;
  }

  goToNextPage() {
    this.nav.push('ThirdPage', { paramOne: 'one one one', paramTwo: 'two two two'});
  }
}
