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
    this.disableAll();
    this.menuCtrl.enable(false);
  }

  push() {
    this.navCtrl.push('PageTwo');
  }

  menuDefault() {
    this.disableAll();
    this.menuCtrl.enable(true, 'menu_default');
  }

  menuStart() {
    this.disableAll();
    this.menuCtrl.enable(true, 'menu_start');
  }

  menuEnd() {
    this.disableAll();
    this.menuCtrl.enable(true, 'menu_end');
  }

  menuLeft() {
    this.disableAll();
    this.menuCtrl.enable(true, 'menu_left');
  }

  menuRight() {
    this.disableAll();
    this.menuCtrl.enable(true, 'menu_right');
  }

  disableAll() {
    this.menuCtrl.enable(false);

  }
}
