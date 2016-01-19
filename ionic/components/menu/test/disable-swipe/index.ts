import {App, IonicApp, Page, NavController} from 'ionic/ionic';

@Page({
  templateUrl: 'page1.html'
})
class Page1 {
  leftMenuSwipeEnabled: boolean = true;
  rightMenuSwipeEnabled: boolean = false;

  constructor(app: IonicApp) {
    this.app = app;
  }

  toggleLeftMenuSwipeable() {
    this.leftMenuSwipeEnabled = !this.leftMenuSwipeEnabled;

    this.app.getComponent('leftMenu').swipeEnable(this.leftMenuSwipeEnabled);
  }

  toggleRightMenuSwipeable() {
    this.rightMenuSwipeEnabled = !this.rightMenuSwipeEnabled;

    this.app.getComponent('rightMenu').swipeEnable(this.rightMenuSwipeEnabled);
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
