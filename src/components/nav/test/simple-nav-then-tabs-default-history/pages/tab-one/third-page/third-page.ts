import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../../..';

@IonicPage({
  segment: 'thirdPage/paramOne/:paramOne/paramTwo/:paramTwo',
  defaultHistory: ['FirstPage']
})
@Component({
  templateUrl: 'third-page.html'
})
export class ThirdPage {

  paramOne: string;
  paramTwo: string;

  constructor(public nav: NavController, public params: NavParams) {
    this.paramOne = this.params.data.paramOne;
    this.paramTwo = this.params.data.paramTwo;
  }
}
