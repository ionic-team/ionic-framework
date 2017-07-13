import { Component } from '@angular/core';
import { IonicPage, NavParams } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'detail-page.html'
})
export class DetailPage {
  city: string;

  constructor(_navParams: NavParams) {
    this.city = _navParams.get('city');
  }
}
