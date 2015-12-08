import {App, Page, IonicApp, Config, Platform} from 'ionic/ionic';
import {NavController, NavParams} from 'ionic/ionic';

var PAGE_NUM = 2;

@App({
  templateUrl: 'app.html'
})
class ApiDemoApp {

  constructor() {
    this.rootPage = InitialPage;
  }
}

@Page({
  templateUrl: 'main.html'
})
export class InitialPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(Page2);
  }
}

@Page({
    templateUrl: "page-2.html"
})
export class Page2 {
    constructor(
        nav: NavController,
    ) {
        this.nav = nav;
        this.pageNum = PAGE_NUM;
    }

    push() {
      PAGE_NUM++;
      this.nav.push(Page2);
    }

    pop() {
      if (PAGE_NUM > 2) {
        PAGE_NUM--;        
      }
      this.nav.pop();
    }
}

