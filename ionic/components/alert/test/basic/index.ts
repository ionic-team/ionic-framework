import {App, Alert, OverlayController} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  constructor(private overlay: OverlayController) {
    this.alertOpen = false;
    this.confirmOpen = false;
    this.confirmResult = '';
    this.promptOpen = false;
    this.promptResult = '';
  }

  doAlert() {
    let alert = Alert.create({
      title: 'Alert!',
      subTitle: 'My alert subtitle',
      bodyText: 'My alert body text',
      buttons: ['Ok']
    });

    alert.onClose(() => {
      this.alertOpen = false;
    });

    this.overlay.push(alert).then(() => {
      this.alertOpen = true;
    });
  }

  doPrompt() {
    let alert = Alert.create();
    alert.setTitle('Prompt!');
    alert.addInput({
      label: 'Input Label',
      placeholder: 'Placeholder'
    });
    alert.addButton({
      text: 'Cancel',
      handler: () => {
        console.log('500ms delayed prompt close');

        setTimeout(() => {
          console.log('Prompt close');
          alert.close();
        }, 500);

        return false;
      }
    });
    alert.addButton({
      text: 'Ok',
      handler: () => {
        console.log('Prompt Ok');
      }
    });

    alert.onClose(data => {
      this.promptOpen = false;
    });

    this.overlay.push(alert).then(() => {
      this.promptOpen = true;
    });
  }

  doConfirm() {

  }
}
