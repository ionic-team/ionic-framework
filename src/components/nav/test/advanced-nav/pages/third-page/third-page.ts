import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'third-page.html'
})
export class ThirdPage {
  constructor(public nav: NavController) {
  }

  nextPage() {
    this.nav.push('FourthPage', { carId: '123', make: 'Toyota', model: 'Carolla'});
  }
}
