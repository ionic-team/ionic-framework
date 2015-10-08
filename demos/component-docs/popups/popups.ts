import {IonicPlatform, IonicView, Popup} from 'ionic/ionic';

@IonicView({
    templateUrl: 'popups/popups.html',
})
export class PopupsPage {

  constructor(popup: Popup) {
    this.popup = popup;
  }

  showPopup() {
    this.popup.alert("Popup Title").then(() => {
    });
  }
}