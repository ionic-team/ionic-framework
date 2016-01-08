import {App, Page, Alert, NavController} from 'ionic/ionic';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {

  constructor(nav: NavController) {
    this.nav = nav;
    this.testConfirmOpen = false;
    this.testPromptOpen = false;
    this.testConfirmResult = '';
    this.testPromptResult = '';
  }

  doAlert() {
    let alert = Alert.create({
      title: 'Alert!',
      subTitle: 'Subtitle!!!',
      buttons: ['Ok']
    });

    this.nav.present(alert);
  }

  doConfirm() {
    let alert = Alert.create();
    alert.setTitle('Confirm!');
    alert.setBody('Body text!!!');
    alert.addButton({
      text: 'Cancel',
      handler: () => {
        console.log('Confirm Cancel');
        this.testConfirmResult = 'Cancel';
        this.testConfirmOpen = false;
      }
    });
    alert.addButton({
      text: 'Ok',
      handler: () => {
        console.log('Confirm Ok');
        this.testConfirmResult = 'Ok';
        this.testConfirmOpen = false;
      }
    });

    this.nav.present(alert).then(() => {
      this.testConfirmOpen = true;
    });
  }

  doPrompt() {
    let alert = Alert.create();
    alert.setTitle('Prompt!');
    alert.addInput({
      placeholder: 'Placeholder 1'
    });
    alert.addInput({
      name: 'name2',
      value: 'hello',
      placeholder: 'Placeholder 2'
    });
    alert.addButton({
      text: 'Cancel',
      handler: data => {
        console.log('500ms delayed prompt close');

        setTimeout(() => {
          console.log('Prompt close');
          alert.dismiss(data);
        }, 500);

        return false;
      }
    });
    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Prompt data:', data);
        this.testPromptOpen = false;
        this.testPromptResult = data;
      }
    });

    this.nav.present(alert).then(() => {
      this.testPromptOpen = true;
    });

    alert.onDismiss(data => {
      console.log('onDismiss data', data);
    });
  }

  doRadio() {
    let alert = Alert.create();
    alert.setTitle('Radio!');

    alert.addInput({
      type: 'radio',
      label: 'Radio 1',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Radio 2',
      value: 'value2'
    });

    alert.addInput({
      type: 'radio',
      label: 'Radio 3',
      value: 'value3'
    });

    alert.addInput({
      type: 'radio',
      label: 'Radio 4',
      value: 'value4'
    });

    alert.addInput({
      type: 'radio',
      label: 'Radio 5',
      value: 'value5'
    });

    alert.addInput({
      type: 'radio',
      label: 'Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 ',
      value: 'value6'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Radio data:', data);
        this.testRadioOpen = false;
        this.testRadioResult = data;
      }
    });

    this.nav.present(alert).then(() => {
      this.testRadioOpen = true;
    });
  }

}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  constructor() {
    this.root = E2EPage;
  }
}
