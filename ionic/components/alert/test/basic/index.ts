import {App, Alert, OverlayController} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  constructor(private overlay: OverlayController) {
    this.alertOpen = false;
    this.confirmOpen = false;
    this.promptOpen = false;
    this.promptResult = '';
  }

  doAlert() {
    let alert = Alert.create({
      title: 'Alert!',
      subTitle: 'Subtitle!!!',
      buttons: ['Ok'],
      onClose: () => {
        this.alertOpen = false;
      }
    });

    this.overlay.push(alert);

    this.alertOpen = true;
  }

  doConfirm() {
    let alert = Alert.create();
    alert.setTitle('Confirm!');
    alert.setBody('Body text!!!');
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: () => {
        console.log('Confirm Ok');
      }
    });

    alert.onClose(data => {
      this.confirmOpen = false;
    });

    this.overlay.push(alert).then(() => {
      this.confirmOpen = true;
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
      handler: data => {
        console.log('500ms delayed prompt close');

        setTimeout(() => {
          console.log('Prompt close');
          alert.close(data);
        }, 500);

        return false;
      }
    });
    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Prompt data:', data);
      }
    });

    alert.onClose(data => {
      this.promptOpen = false;
      this.promptResult = data;
    });

    this.overlay.push(alert).then(() => {
      this.promptOpen = true;
    });
  }
}
