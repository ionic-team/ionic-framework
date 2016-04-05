import {ViewChild, ElementRef} from 'angular2/core';
import {App, Page} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  items = [];

  @ViewChild('content') content: ElementRef;

  constructor() {
    for (var i = 0; i < 14; i++) {
      this.items.push(i);
    }

  }

  headerFn(record: any, index: number, records: any[]) {
    if (index % 4 === 0) {
      return index + ' is divisible by 4';
    }

    return null;
  }

  reload() {
    window.location.reload(true);
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
