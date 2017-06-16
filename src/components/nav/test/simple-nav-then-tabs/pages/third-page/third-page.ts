import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../..';

@IonicPage({
})
@Component({
  templateUrl: 'third-page.html'
})
export class ThirdPage {

  userId: string;
  name: string;

  constructor(public nav: NavController, public params: NavParams) {
    this.userId = this.params.data.userId;
    this.name = this.params.data.name;
  }
}
