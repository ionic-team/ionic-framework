import { Component } from '@angular/core';

import { ionicBootstrap } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoPage {
  gender: string;
  gaming: string;
  toppings: Array<string>;
  petAlertOpts;
  petData;
  pets: Array<string>;
  notifications: string = 'mute_1';
  rating: number = 2;

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


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);
