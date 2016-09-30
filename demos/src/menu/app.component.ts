import { Component } from '@angular/core';

import { MenuController } from 'ionic-angular';


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  activeMenu: string;

  constructor(public menu: MenuController) {
    this.menu1Active();
  }
  menu1Active() {
    this.activeMenu = 'menu1';
    this.menu.enable(true, 'menu1');
    this.menu.enable(false, 'menu2');
  }
  menu2Active() {
    this.activeMenu = 'menu2';
    this.menu.enable(false, 'menu1');
    this.menu.enable(true, 'menu2');
  }
}


@Component({
  templateUrl: 'app.html'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}
