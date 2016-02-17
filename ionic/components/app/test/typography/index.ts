import {App, IonicApp} from '../../../../../ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor(app: IonicApp) {
    app.setTitle('Basic Buttons');
  }
}
