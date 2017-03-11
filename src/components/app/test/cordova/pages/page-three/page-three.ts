import { Component } from '@angular/core';
import { DeepLink, NavController } from '../../../../../..';

@DeepLink({
  name: 'page-three'
})
@Component({
  templateUrl: 'page-three.html'
})
export class PageThree {
  constructor(public navCtrl: NavController) {}

  goBack() {
    this.navCtrl.pop();
  }
}
