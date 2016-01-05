import {App, Page, NavController} from 'ionic/ionic';

@Page({
  templateUrl: 'first.html'
})
class FirstPage {
  constructor(private _nav: NavController) {

  }

  goToSecond() {
    this._nav.push(SecondPage);
  }
}

@Page({
  templateUrl: 'second.html'
})
class SecondPage {

}

@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  constructor() {
    this.root = FirstPage;
  }
}
