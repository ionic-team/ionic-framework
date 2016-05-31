import {Component} from '@angular/core';
import {ionicBootstrap, MenuController} from '../../../../../src';


@Component({
  templateUrl: 'page1.html'
})
class Page1 {
  activeMenu: string;

  constructor(private menu: MenuController) {
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
class E2EApp {
  rootPage = Page1;
}

ionicBootstrap(E2EApp);
