import { Component } from '@angular/core';

import { ionicBootstrap, MenuController } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoPage {
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
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);
