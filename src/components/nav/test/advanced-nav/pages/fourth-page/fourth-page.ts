import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../..';

@IonicPage({
  segment: 'pageFour/car/:carId/make/:make/model/:model'
})
@Component({
  templateUrl: 'fourth-page.html'
})
export class FourthPage {

  carId: string;
  make: string;
  model: string;
  constructor(public nav: NavController, public params: NavParams) {
    this.carId = this.params.data.carId;
    this.make = this.params.data.make;
    this.model = this.params.data.model;
  }
}
