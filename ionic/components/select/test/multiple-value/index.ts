import {App, Page} from 'ionic-angular';
import {Control, ControlGroup} from 'angular2/common';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  toppings: Array<string>;
  carFeatures: Array<string>;
  pets: Array<string>;
  petOptions: Array<{text: string, value: string}>;
  authForm: ControlGroup;

  constructor() {
    this.toppings = ['bacon', 'xcheese'];
    this.carFeatures = [];
    this.pets = ['cat', 'dog'];
    this.petOptions = [
      { text: 'Bird', value: 'bird' },
      { text: 'Cat', value: 'cat' },
      { text: 'Dog', value: 'dog' },
      { text: 'Honey Badger', value: 'honeybadger' },
      { text: 'Pig', value: 'pig' },
    ];

    this.authForm = new ControlGroup({
      name: new Control(''),
      select: new Control([1, '3'])
    });
  }

  carChange(selectedValues) {
    console.log('carChange', selectedValues);
  }

  onSubmit(data) {
    console.log('onSubmit', data);
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
