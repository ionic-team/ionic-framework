import {App, Page} from '../../../../../ionic/ionic';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  musicAlertOpts;
  gender: string;
  gaming: string;
  os: string;
  music: string;
  month: string;
  year: string;

  constructor() {
    this.gaming = '';
    this.os = 'win3.1';
    this.music = null;
    this.month = '12';
    this.year = '1994';

    this.musicAlertOpts = {
      title: '1994 Music',
      subTitle: 'Select your favorite'
    };

    setTimeout(() => {
      this.gender = 'm';
    }, 1500);
  }

  gamingCancel() {
    console.log('Gaming Select, Cancel');
  }

  gamingChange(selectedValue) {
    console.log('Gaming Select, Change value:', selectedValue);
  }

  stpSelect() {
    console.log('STP selected')
  }

  resetGender() {
    this.gender = null;
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
