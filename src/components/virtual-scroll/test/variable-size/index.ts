import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  items: any[] = [];

  constructor() {

    for (var i = 0; i < 5000; i++) {

      this.items.push({
        isHeader: ((i % 10) === 0),
        fontSize: Math.floor((Math.random() * 32) + 16) + 'px',
        item: i
      });

    }
  }

  headerFn(record: any, recordIndex: number) {
    if (recordIndex > 0 && recordIndex % 100 === 0) {
      return recordIndex;
    }
    return null;
  }

}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>',
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp, null, {
  prodMode: true
});
