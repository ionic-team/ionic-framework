import {App, Page} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  toppings: Array<string>;
  carFeatures: Array<string>;
  pets: Array<string>;
  petOptions: Array<{text: string, value: string}>;

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
  }

  carChange(selectedValues) {
    console.log('carChange', selectedValues);
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
