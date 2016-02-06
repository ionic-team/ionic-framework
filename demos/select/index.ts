import {App, Page} from 'ionic/ionic';

@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  constructor() {
    this.root = MainPage;
  }
}

@Page({
  templateUrl: 'main.html'
})
class MainPage {
  constructor() {
    this.musicAlertOpts = {
      title: '1994 Music',
      subTitle: 'Select your favorite'
    };

    this.petOptions = [
      { text: 'Bird', value: 'bird' },
      { text: 'Cat', value: 'cat', checked: true },
      { text: 'Dog', value: 'dog', checked: true },
      { text: 'Honey Badger', value: 'honeybadger' },
      { text: 'Pig', value: 'pig' },
    ];
  }
}
