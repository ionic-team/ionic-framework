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
    this.popup.alert('What!?').then(() => {
    }, () => {
    });
  }

  doPrompt() {
    this.popup.prompt('What is your name?').then((name, event) => {
      console.log('Got response', name);
    }, () => {
      console.error('Prompt closed');
    });
  }

  doConfirm() {
    this.popup.confirm('Are you sure?').then((yes, event) => {
      console.log('CONFIRMED', yes);
    }, () => {
      console.error('NOT CONFIRMED');
    });
  }
}
