import {App, Page} from '../../../../../src';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {

  onTap(ev) {
    console.log('onTap', ev);
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
