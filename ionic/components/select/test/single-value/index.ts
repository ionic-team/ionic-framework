import {App, Page} from 'ionic/ionic';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  constructor() {
    this.musicAlertOpts = {
      title: '1994 Music',
      subTitle: 'Select your favorite'
    };

    setTimeout(() => {
      this.gender = 'm';
    }, 1500);
  }

  stpSelect() {
    console.log('STP selected')
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
