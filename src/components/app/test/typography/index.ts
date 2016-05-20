import {App, IonicApp} from '../../../../../src';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor(app: IonicApp) {
    app.setTitle('Basic Buttons');
  }
}
