import { Component } from '@angular/core';
import { MenuController, NavController } from '../../../../../..';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
  ) {
    this.menuCtrl.enable(false, 'menu4');
  }

  push() {
    this.navCtrl.push('PageTwo');
  }

  menu1Active() {
    this.menuCtrl.enable(false, 'menu4');
    this.menuCtrl.enable(true, 'menu1');
  }
  menu2Active() {
    this.menuCtrl.enable(false, 'menu4');
    this.menuCtrl.enable(true, 'menu2');
  }
  menu3Active() {
    this.menuCtrl.enable(false, 'menu4');
    this.menuCtrl.enable(true, 'menu3');
  }
  menu4Active() {
    this.menuCtrl.enable(false, 'menu1');
    this.menuCtrl.enable(false, 'menu2');
    this.menuCtrl.enable(false, 'menu3');

    this.menuCtrl.enable(true, 'menu4');
  }

  disableAll() {
    this.menuCtrl.enable(false);
  }
}
