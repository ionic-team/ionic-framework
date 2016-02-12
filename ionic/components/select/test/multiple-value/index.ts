import {App, Page} from '../../../../../ionic/ionic';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {

  constructor() {
    this.petOptions = [
      { text: 'Bird', value: 'bird' },
      { text: 'Cat', value: 'cat', checked: true },
      { text: 'Dog', value: 'dog', checked: true },
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
  constructor() {
    this.root = E2EPage;
  }
}
