import {App, IonicApp, IonicView, NavController} from 'ionic/ionic';


@IonicView({
  templateUrl: 'home-page.html'
})
class HomePage {

  constructor(app: IonicApp) {
    this.app = app;
  }

  toggleAside() {
    console.log('toggleAside')
    this.app.getComponent('mainMenu').toggle();
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

  closeMenu() {
    this.app.getComponent('mainMenu').close();
  }

}
