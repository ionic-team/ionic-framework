import {App, Page} from 'ionic/ionic';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {

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
