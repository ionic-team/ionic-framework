import {App, Page} from 'ionic-angular';

@Page({
  templateUrl: 'main.html'
})
class MainPage {
  gender: string;
  gaming: string;
  toppings: Array<string>;
  petAlertOpts;
  petData;
  pets: Array<string>;

  constructor() {
    this.gender = 'f';
    this.gaming = 'n64';

    this.petAlertOpts = {
      title: 'Like Pets?',
      subTitle: 'Select your favorite'
    };

    this.toppings = ['bacon', 'xcheese'];

    this.petData = [
      { text: 'Bird', value: 'bird' },
      { text: 'Cat', value: 'cat' },
      { text: 'Dog', value: 'dog' },
      { text: 'Honey Badger', value: 'honeybadger' },
    ];

    this.pets = ['cat', 'dog'];
  }

  monthChange(val) {
    console.log('Month Change:', val);
  }

  yearChange(val) {
    console.log('Year Change:', val);
  }
}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root;

  constructor() {
    this.root = MainPage;
  }
}
