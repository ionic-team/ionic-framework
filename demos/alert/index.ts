import {App, Page, Alert, NavController} from 'ionic-angular';


@App({
  templateUrl: 'app.html'
})
class ApiDemoApp {
  constructor() {
    this.rootPage = InitialPage;
  }
}


@Page({
  templateUrl: 'main.html'
})
export class InitialPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  doAlert() {
    let alert = Alert.create({
      title: 'New Friend!',
      subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
      buttons: ['Ok']
    });

    this.nav.present(alert);
  }

  doConfirm() {
    let alert = Alert.create({
      title: 'Use this lightsaber?',
      body: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });

    this.nav.present(alert);
  }

  doPrompt() {
    let alert = Alert.create({
      title: 'Login',
      body: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });

    this.nav.present(alert);
  }

  doRadio() {
    let alert = Alert.create();
    alert.setTitle('Lightsaber color');

    alert.addInput({
      type: 'radio',
      label: 'Blue',
      value: 'blue',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Green',
      value: 'green'
    });

    alert.addInput({
      type: 'radio',
      label: 'Red',
      value: 'red'
    });

    alert.addInput({
      type: 'radio',
      label: 'Yellow',
      value: 'yellow'
    });

    alert.addInput({
      type: 'radio',
      label: 'Purple',
      value: 'purple'
    });

    alert.addInput({
      type: 'radio',
      label: 'White',
      value: 'white'
    });

    alert.addInput({
      type: 'radio',
      label: 'Black',
      value: 'black'
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

    this.nav.present(alert);
  }

  doCheckbox() {
    let alert = Alert.create();
    alert.setTitle('Which planets have you visited?');

    alert.addInput({
        type: 'checkbox',
        label: 'Alderaan',
        value: 'value1',
        checked: true
    });

    alert.addInput({
        type: 'checkbox',
        label: 'Bespin',
        value: 'value2'
    });

    alert.addInput({
        type: 'checkbox',
        label: 'Coruscant',
        value: 'value3'
    });

    alert.addInput({
        type: 'checkbox',
        label: 'Endor',
        value: 'value4'
    });

    alert.addInput({
        type: 'checkbox',
        label: 'Hoth',
        value: 'value5'
    });

    alert.addInput({
        type: 'checkbox',
        label: 'Jakku',
        value: 'value6'
    });

    alert.addInput({
        type: 'checkbox',
        label: 'Naboo',
        value: 'value6'
    });

    alert.addInput({
        type: 'checkbox',
        label: 'Takodana',
        value: 'value6'
    });

    alert.addInput({
        type: 'checkbox',
        label: 'Tatooine',
        value: 'value6'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
          console.log('Checkbox data:', data);
          this.testCheckboxOpen = false;
          this.testCheckboxResult = data;
      }
    });

    this.nav.present(alert);
  }

}
