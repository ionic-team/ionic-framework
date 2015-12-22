import {App, Alert} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  constructor() {
    this.alertOpen = false;
    this.confirmOpen = false;
    this.confirmResult = '';
    this.promptOpen = false;
    this.promptResult = '';
  }

  doAlert() {
    debugger;
    let alert = Alert.create();
  }

  doPrompt() {

  }

  doConfirm() {

  }
}
