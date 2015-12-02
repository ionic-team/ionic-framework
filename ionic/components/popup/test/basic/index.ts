import {App, Popup} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  constructor(popup: Popup) {
    this.popup = popup;
    this.alertOpen = false;
    this.promptOpen = false;
    this.promptResult = '';
    this.confirmOpen = false;
    this.confirmResult = '';
  }

  doAlert() {
    this.alertOpen = true;
    this.popup.alert({
      title: "New Friend!",
      template: "Your friend, Obi wan Kenobi, just accepted your friend request!",
      cssClass: 'my-alert'
    }).then(() => {
      this.alertOpen = false;
    });
  }

  doPrompt() {
    this.promptOpen = true;
    this.popup.prompt({
      title: "New Album",
      template: "Enter a name for this new album you're so keen on adding",
      inputPlaceholder: "Title",
      okText: "Save"
    }).then((name) => {
      this.promptResult = name;
      this.promptOpen = false;
    }, () => {
      console.log('Prompt closed');
      this.promptOpen = false;
    });
  }

  doConfirm() {
    this.confirmOpen = true;
    this.popup.confirm({
      title: "Use this lightsaber?",
      subTitle: "You can't exchange lightsabers",
      template: "Do you agree to use this lightsaber to do good across the intergalactic galaxy?",
      cancelText: "Disagree",
      okText: "Agree"
    }).then((result, ev) => {
      console.log('CONFIRMED', result);
      this.confirmResult = result;
      this.confirmOpen = false;
    }, () => {
      this.confirmOpen = false;
      console.log('NOT CONFIRMED');
    });
  }
}
