import {App, Page} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  items = [];

  constructor() {

    for (var i = 0; i < 5000; i++) {

      this.items.push({
        isHeader: ((i % 10) === 0),
        fontSize: Math.floor((Math.random() * 32) + 16) + 'px',
        item: i
      });

    }
  }

  headerFn(record, recordIndex) {
    if (recordIndex > 0 && recordIndex % 100 === 0) {
      return recordIndex;
    }
    return null;
  }

}


@App({
  template: '<ion-nav [root]="root"></ion-nav>',
})
class E2EApp {
  root;
  constructor() {
    this.root = E2EPage;
  }
}
