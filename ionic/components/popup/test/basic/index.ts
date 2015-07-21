import {App, IonicView, IonicApp, IonicConfig, Platform} from 'ionic/ionic';
import {Popup} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class MyAppCmp {

  constructor(popup: Popup, app: IonicApp, ionicConfig: IonicConfig) {
    this.popup = popup;

  }

  doAlert() {
    this.popup.alert('What!?');
  }
}
