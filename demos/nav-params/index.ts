import {App, Page, IonicApp, Config, Platform} from 'ionic-angular';
import {NavController, NavParams} from 'ionic-angular';


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
    this.myParam = '';
  }

  pushParams() {
    this.nav.push(Page2, { 'myParam': this.myParam });
  }
}

@Page({
    templateUrl: "page-2.html"
})
export class Page2 {
    constructor(
        nav: NavController,
        params: NavParams
    ) {
        this.nav = nav;
        this.myParam = params.get('myParam');
    }
}

