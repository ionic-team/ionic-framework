import {App, Alert} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor(alert: Alert) {
    this.alert = alert;
  }

  showAlert() {
    this.alert.open({

    });
  }
}
