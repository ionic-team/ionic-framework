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
    this.popup.alert('Alert').then(() => {
      this.alertOpen = false;
    });
  }

  doPrompt() {
    this.promptOpen = true;
    this.popup.prompt('What is your name?').then((name) => {
      this.promptResult = name;
      this.promptOpen = false;
    }, () => {
      console.error('Prompt closed');
      this.promptOpen = false;
    });
  }

  doConfirm() {
    this.confirmOpen = true;
    this.popup.confirm('Are you sure?').then((result, ev) => {
      console.log('CONFIRMED', result);
      this.confirmResult = result;
      this.confirmOpen = false;
    }, () => {
      this.confirmOpen = false;
      console.error('NOT CONFIRMED');
    });
  }
}
