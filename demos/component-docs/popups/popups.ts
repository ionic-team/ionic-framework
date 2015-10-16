import {Page, Popup} from 'ionic/ionic';

@Page({
    templateUrl: 'popups/popups.html',
})
export class PopupsPage {

  constructor(popup: Popup) {
    this.popup = popup;
  }

  doAlert() {
    this.popup.alert({
      title: "New Friend!",
      template: "Your friend, Obi wan Kenobi, just accepted your friend request!",
      cssClass: 'my-alert'
    });
  }

  doPrompt() {
    this.popup.prompt({
      title: "New Album",
      template: "Enter a name for this new album you're so keen on adding",
      inputPlaceholder: "Title",
      okText: "Save"
    });
  }

  doConfirm() {
    this.popup.confirm({
      title: "Use this lightsaber?",
      subTitle: "You can't exchange lightsabers",
      template: "Do you agree to use this lightsaber to do good across the intergalactic galaxy?",
      cancelText: "Disagree",
      okText: "Agree"
    });
  }
}
