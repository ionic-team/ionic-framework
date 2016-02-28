import {App, Page, MenuController} from 'ionic-angular';

@Page({templateUrl: 'page1.html'})
class Page1 {
  constructor(menu: MenuController) {
    this.menu = menu;
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

@App({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  constructor() {
    this.rootView = Page1;
  }
}
