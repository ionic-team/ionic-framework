import {App, Page, ActionSheet, NavController} from 'ionic/ionic';


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

  present() {
    let actionSheet = ActionSheet.create({
      buttons: [
        {
          text: 'Destructive',
          style: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
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
