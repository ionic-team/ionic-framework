import {App, Page, IonicApp, Config, Platform} from 'ionic/ionic';
import {ActionSheet} from 'ionic/ionic';

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
  constructor(actionSheet: ActionSheet, platform: Platform) {
    this.actionSheet = actionSheet;
    this.platform = platform;
  }

  open() {

    this.actionSheet.open({
      buttons: [
        { text: 'Share'},
        { text: 'Play'},
        { text: 'Favorite'}
      ],
      destructiveText: 'Delete',
      titleText: 'Albums',
      cancelText: 'Cancel',
      cancel: () => {
        console.log('Canceled');
      },
      destructiveButtonClicked: () => {
        console.log('Destructive clicked');
      },
      buttonClicked: (index) => {
        console.log('Button clicked', index);
        if (index == 1) { return false; }
        return true;
      }

    }).then(actionSheetRef => {
      this.actionSheetRef = actionSheetRef;
    });
  }
}

