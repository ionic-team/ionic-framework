import {App, IonicApp, IonicView, NavController} from 'ionic/ionic';


@IonicView({
  templateUrl: 'home-page.html'
})
class HomePage {
  constructor(app: IonicApp) {
    this.app = app;
  }
}


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  constructor(app: IonicApp) {
    this.app = app;
    this.rootView = HomePage;
  }
}
