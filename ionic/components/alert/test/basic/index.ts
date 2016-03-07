import {App, Page, Alert, Modal, NavController, ViewController} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  testConfirmOpen: boolean = false;
  testPromptOpen: boolean = false;
  testConfirmResult: string = '';
  testPromptResult: string = '';

  constructor(private nav: NavController) { }

  doAlert() {
    let alert = Alert.create({
      title: 'Alert',
      subTitle: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    this.nav.present(alert);
  }

  doConfirm() {
    let alert = Alert.create();
    alert.setTitle('Confirm!');
    alert.setMessage('Message <strong>text</strong>!!!');
    alert.addButton({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Confirm Cancel');
        this.testConfirmResult = 'Cancel';
        this.testConfirmOpen = false;
      }
    });
    alert.addButton({
      text: 'Okay',
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

  doAlertLongMessage() {
    let alert = Alert.create({
      title: 'Alert',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit diam lorem, a faucibus turpis sagittis eu. In finibus augue in dui varius convallis. Donec vulputate nibh gravida odio vulputate commodo. Suspendisse imperdiet consequat egestas. Nulla feugiat consequat urna eu tincidunt. Cras nec blandit turpis, eu auctor nunc. Pellentesque finibus, magna eu vestibulum imperdiet, arcu ex lacinia massa, eget volutpat quam leo a orci. Etiam mauris est, elementum at feugiat at, dictum in sapien. Mauris efficitur eros sodales convallis egestas. Phasellus eu faucibus nisl. In eu diam vitae libero egestas lacinia. Integer sed convallis metus, nec commodo felis. Duis libero augue, ornare at tempus non, posuere vel augue. Cras mattis dui at tristique aliquam. Phasellus fermentum nibh ligula, porta hendrerit ligula elementum eu. Suspendisse sollicitudin enim at libero iaculis pulvinar. Donec ac massa id purus laoreet rutrum quis eu urna. Mauris luctus erat vel magna porttitor, vel varius erat rhoncus. Donec eu turpis vestibulum, feugiat urna id, gravida mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at lobortis tortor. Nam ultrices volutpat elit, sed pharetra nulla suscipit at. Nunc eu accumsan eros, id auctor libero. Suspendisse potenti. Nam vitae dapibus metus. Maecenas nisi dui, sagittis et condimentum eu, bibendum vel eros. Vivamus malesuada, tortor in accumsan iaculis, urna velit consectetur ante, nec semper sem diam a diam. In et semper ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit, velit vel porttitor euismod, neque risus blandit nulla, non laoreet libero dolor et odio. Nulla enim risus, feugiat eu urna sed, ultrices semper felis. Sed blandit mi diam. Nunc quis mi ligula. Pellentesque a elit eu orci volutpat egestas. Aenean fermentum eleifend quam, ut tincidunt eros tristique et. Nam dapibus tincidunt ligula, id faucibus felis sodales quis. Donec tincidunt lectus ipsum, ac semper tellus cursus ac. Vestibulum nec dui a lectus accumsan vestibulum quis et velit. Aliquam finibus justo et odio euismod, viverra condimentum eros tristique. Sed eget luctus risus. Pellentesque lorem magna, dictum non congue sodales, laoreet eget quam. In sagittis vulputate dolor a ultricies. Donec viverra leo sed ex maximus, in finibus elit gravida. Aliquam posuere vulputate mi. Suspendisse potenti. Nunc consectetur congue arcu, at pharetra dui varius non. Etiam vestibulum congue felis, id ullamcorper neque convallis ultrices. Aenean congue, diam a iaculis mollis, nisl eros maximus arcu, nec hendrerit purus felis porta diam. Nullam vitae ultrices dui, ac dictum sapien. Phasellus eu magna luctus, varius urna id, molestie quam. Nulla in semper tellus. Curabitur lacinia tellus sit amet lacinia dapibus. Sed id condimentum tellus, nec aliquam sapien. Vivamus luctus at ante a tincidunt.',
      buttons: ['Cancel', 'OK']
    });
    this.nav.present(alert);
  }

  doAlertNoMessage() {
    let alert = Alert.create({
      title: 'Alert',
      buttons: ['OK']
    });
    this.nav.present(alert);
  }

  doMultipleButtons() {
    let alert = Alert.create({
      title: 'Alert',
      subTitle: 'Subtitle',
      message: 'This is an alert message.'
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Open Modal',
      handler: () => {
        let modal = Modal.create(ModalPage);
        this.nav.present(modal);

        // do not close the alert when this button is pressed
        return false;
      }
    });
    alert.addButton('Delete');
    this.nav.present(alert);
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
    alert.addInput({
      name: 'name3',
      value: 'http://ionicframework.com',
      type: 'url',
      placeholder: 'Favorite site ever'
    });
    alert.addButton({
      text: 'Cancel',
      handler: data => {
        console.log('500ms delayed prompt close');

        setTimeout(() => {
          console.log('Prompt close');
          alert.dismiss(data);
        }, 500);

        // do not close the alert when this button is pressed
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

    alert.onDismiss((data, role) => {
      console.log('onDismiss, data:', data, 'role:', role);
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

  doCheckbox() {
    let alert = Alert.create();
    alert.setTitle('Checkbox!');

    alert.addInput({
      type: 'checkbox',
      label: 'Checkbox 1',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Checkbox 2',
      value: 'value2'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Checkbox 3',
      value: 'value3'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Checkbox 4',
      value: 'value4'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Checkbox 5',
      value: 'value5'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6',
      value: 'value6'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Checkbox data:', data);
        this.testCheckboxOpen = false;
        this.testCheckboxResult = data;
      }
    });

    this.nav.present(alert).then(() => {
      this.testCheckboxOpen = true;
    });
  }

  doFastClose() {
    let alert = Alert.create({
      title: 'Alert!',
      buttons: ['OK']
    });

    this.nav.present(alert);

    setTimeout(() => {
      alert.dismiss();
    }, 200);
  }

  doDisabledBackdropAlert() {
    let alert = Alert.create({
      enableBackdropDismiss: false
    });
    alert.setTitle('Disabled Backdrop Click'),
    alert.setMessage('Cannot dismiss alert from clickings the backdrop'),
    alert.addButton({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Confirm Cancel');
      }
    });

    this.nav.present(alert);
  }

  onPageDidLeave() {
    console.log('E2EPage, onPageDidLeave');
  }

  onPageDidEnter() {
    console.log('E2EPage, onPageDidEnter');
  }
}

@Page({
  template: `
    <ion-toolbar>
      <ion-buttons>
        <button (click)="dismiss()">Close</button>
      </ion-buttons>
      <ion-title>Modal</ion-title>
    </ion-toolbar>
    <ion-content padding>
      Hi, I'm Bob, and I'm a modal.
    </ion-content>
  `
})
class ModalPage {
  constructor(private viewCtrl: ViewController) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }
}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root;
  constructor() {
    this.root = E2EPage;
  }
}
