import {App, IonicApp} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  constructor(app: IonicApp) {
    this.app = app;
  }

  toggleAside() {
    console.log('toggleAside')
    this.app.getComponent('mainMenu').toggle();
  }

}
