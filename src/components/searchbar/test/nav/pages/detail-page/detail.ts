import { Component } from '@angular/core';
import { NavParams } from '../../../../../..';

@Component({
  templateUrl: 'detail.html'
})
export class DetailPage {
  city: string;

  constructor(private _navParams: NavParams) {
    this.city = _navParams.get('city');
  }
}
