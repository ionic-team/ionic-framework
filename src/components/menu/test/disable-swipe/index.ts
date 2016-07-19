import { Component } from '@angular/core';
import { ionicBootstrap, NavController, MenuController } from '../../../../../src';


@Component({
  templateUrl: 'page1.html'
})
class Page1 {
  leftMenuSwipeEnabled: boolean = true;
  rightMenuSwipeEnabled: boolean = false;

  constructor(public menu: MenuController) {}

  toggleLeftMenuSwipeable() {
    this.leftMenuSwipeEnabled = !this.leftMenuSwipeEnabled;

    this.menu.swipeEnable(this.leftMenuSwipeEnabled, 'left');
  }

  toggleRightMenuSwipeable() {
    this.rightMenuSwipeEnabled = !this.rightMenuSwipeEnabled;

    this.menu.swipeEnable(this.rightMenuSwipeEnabled, 'right');
  }
}


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  root = Page1;
}
