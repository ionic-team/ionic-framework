import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../../..';

@IonicPage({
  segment: 'sixthPage/paramOne/:paramOne/paramTwo/:paramTwo'
})
@Component({
  templateUrl: 'sixth-page.html'
})
export class SixthPage {

  paramOne: string;
  paramTwo: string;

  constructor(public nav: NavController, public params: NavParams) {
    this.paramOne = this.params.data.paramOne;
    this.paramTwo = this.params.data.paramTwo;
  }
}
