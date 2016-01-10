import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html',
  config: {
    scrollAssist: true
  }
})
class E2EApp {
  reload() {
    window.location.reload();
  }
}
