import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../..';

@IonicPage({
  segment: 'fourth-page/user/:userId/name/:name'
})
@Component({
  templateUrl: 'fourth-page.html'
})
export class FourthPage {

  userId: string;
  name: string;
  constructor(public nav: NavController, public params: NavParams) {
    this.userId = this.params.data.userId;
    this.name = this.params.data.name;
  }
}
