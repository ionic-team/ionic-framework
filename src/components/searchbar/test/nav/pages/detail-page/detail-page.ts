import { Component } from '@angular/core';
import { DeepLink, NavParams } from '../../../../../..';

@DeepLink()
@Component({
  templateUrl: 'detail-page.html'
})
export class DetailPage {
  city: string;

  constructor(private _navParams: NavParams) {
    this.city = _navParams.get('city');
  }
}
