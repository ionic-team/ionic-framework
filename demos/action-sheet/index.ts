import {App, Page, ActionSheet, NavController, Platform} from 'ionic-angular';


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
  constructor(nav: NavController, platform: Platform) {
    this.nav = nav;
    this.platform = platform;
  }

  present() {
    if (this.platform.is('android')) {
      var androidSheet = {
        title: 'Albums',
        buttons: [
          {
            text: 'Delete',
            style: 'destructive',
            icon: 'md-trash',
            handler: () => {
              console.log('Destructive clicked');
            }
          },
          { text: 'Share',
            icon: 'share',
            handler: () => {
              console.log('Share clicked');
            }
          },
          { text: 'Play',
            icon: 'arrow-dropright-circle',
            handler: () => {
              console.log('Play clicked');
            }
          },
          { text: 'Favorite',
            icon: 'md-heart-outline',
            handler: () => {
              console.log('Favorite clicked');
            }
          },
          {
            text: 'Cancel',
            style: 'cancel',
            icon: 'md-close',
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
          text: 'Delete',
          style: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
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
}
