import {Component} from '@angular/core';
import {ionicBootstrap, MenuController} from 'ionic-angular';


@Component({templateUrl: 'page1.html'})
class Page1 {
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
  templateUrl: 'main.html'
})
class ApiDemoApp {
  root = Page1;
}

ionicBootstrap(ApiDemoApp);
