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
        title: 'Albums',
        buttons: [
          { text: 'Share',
            handler: buttonHandler,
            icon: 'share'
          },
          { text: 'Play',
            handler: buttonHandler,
            icon: 'arrow-dropright-circle'
          },
          { text: 'Favorite',
            handler: buttonHandler,
            icon: 'ion-md-heart-outline'
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
              console.log('Cancel clicked');
            }
          }
        ],
      };
    }

    let actionSheet = ActionSheet.create( androidSheet || {
      buttons: [
        {
          text: 'Share',
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Play',
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
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
            console.log('Cancel clicked');
          }
        }
      ]
    });

    this.nav.present(actionSheet);
  }

  onPageWillLeave() {
    actionSheet && actionSheet.dismiss();
  }

}
