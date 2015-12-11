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

  doRefresh(refresher) {
    console.log('DOREFRESH', refresher)

    setTimeout(() => {
      refresher.complete();
    })
  }

  doStarting() {
    console.log('DOSTARTING');
  }

  doPulling(amt) {
    console.log('DOPULLING', amt);
  }
}

