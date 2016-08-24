import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
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
export class E2EApp {
  root = E2EPage;
}


@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp, {
      prodMode: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
