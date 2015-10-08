import {IonicPlatform, Page, Popup} from 'ionic/ionic';

@Page({
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