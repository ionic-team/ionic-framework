import {App, Page, IonicApp} from 'ionic/ionic';

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
  constructor() {
  }
}

