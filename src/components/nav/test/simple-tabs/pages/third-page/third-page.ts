import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'third-page.html'
})
export class ThirdPage {

  constructor(public nav: NavController, public params: NavParams) {
  }
}
