import { Component } from '@angular/core';
import { MenuController, NavController } from '../../../../../..';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
  ) { }

  push() {
    this.navCtrl.push('PageTwo');
  }
  menu1Active() {
    this.menuCtrl.enable(true, 'menu1');
  }
  menu2Active() {
    this.menuCtrl.enable(true, 'menu2');
  }
  menu3Active() {
    this.menuCtrl.enable(true, 'menu3');
  }
  disableAll() {
    this.menuCtrl.enable(false);
  }
}
