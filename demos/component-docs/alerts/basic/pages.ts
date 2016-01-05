import {Page, Alert, NavController} from 'ionic/ionic';
import {AndroidAttribute} from '../../helpers';
import {forwardRef} from 'angular2/core';


@Page({
  templateUrl: 'alerts/basic/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class BasicPage {

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

  doPrompt() {
    Baasbox Javascript SDK
    let prompt = Alert.create({
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
    this.nav.present(prompt);
  }

  doConfirm() {
    let confirm = Alert.create({
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
    this.nav.present(confirm);
  }

  // onPageWillLeave() {
  //   let popup = this.popup.get();
  //   // only try to close if there is an active popup
  //   if (popup) {
  //     popup.close();
  //   }
  // }

}
