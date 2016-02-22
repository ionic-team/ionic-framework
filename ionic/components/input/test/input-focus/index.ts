import {App} from 'ionic-angular';


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
