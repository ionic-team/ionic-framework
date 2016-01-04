import {Platform, Page, ActionSheet, NavController} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'action-sheets/basic/basic.html',
  directives: [forwardRef(() => AndroidAttribute)]

})
export class BasicPage {

  constructor(platform: Platform, nav: NavController) {
    this.nav = nav;
    this.platform = platform;
  }

  openMenu() {
    let buttonHandler = (index) => {
      console.log('Button clicked', index);
      if (index == 1) { return false; }
      return true;
    }

    if (this.platform.is('android')) {
      var androidSheet = {

        buttons: [
          { text: 'Share', icon: 'share' },
          { text: 'Play', icon: 'arrow-dropright-circle'},
          { text: 'Favorite', icon: 'ion-md-heart-outline'}
        ],
        destructiveText: 'Delete',
        titleText: 'Albums',
        cancelText: 'Cancel',
        cancel: function() {
          console.log('Canceled');
        },
        destructiveButtonClicked: () => {
          console.log('Destructive clicked');
        },
        buttonClicked: function(index) {
          console.log('Button clicked', index);
          if (index == 1) { return false; }
          return true;
        }
      };
    }

    this.actionSheet = ActionSheet.create(androidSheet || {
      title: 'Albums',
      buttons: [
        {
          text: 'Share',
          handler: buttonHandler
        },
        {
          text: 'Play',
          handler: buttonHandler
        },
        {
          text: 'Favorite',
          handler: buttonHandler
        },
        {
          text: 'Delete',
          style: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel',
          handler: () => {
            console.log('Canceled');
          }
        }
      ],

    });

    this.nav.present(this.actionSheet);
  }

  onPageWillLeave() {
    this.actionSheet && this.actionSheet.dismiss();
  }

}
