import {App, Page, NavController, MenuController} from 'ionic-angular';

@Page({
  templateUrl: 'page1.html'
})
class Page1 {
  leftMenuSwipeEnabled: boolean = true;
  rightMenuSwipeEnabled: boolean = false;

  constructor(menu: MenuController) {
    this.menu = menu;
  }

  toggleLeftMenuSwipeable() {
    this.leftMenuSwipeEnabled = !this.leftMenuSwipeEnabled;

    this.menu.swipeEnable(this.leftMenuSwipeEnabled, 'left');
  }

  toggleRightMenuSwipeable() {
    this.rightMenuSwipeEnabled = !this.rightMenuSwipeEnabled;

    this.menu.swipeEnable(this.rightMenuSwipeEnabled, 'right');
  }
}


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor() {
    this.rootView = Page1;
  }
}
