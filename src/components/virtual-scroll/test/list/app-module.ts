import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  items: Array<{title: string; id: number}>;

  constructor() {
    this.fillList();
  }

  fillList() {
    this.items = [];
    for (let i = 0; i < 500; i++) {
      this.items.push({
        title: 'Item ' + i,
        id: i
      });
    }
  }

  emptyList() {
    this.items = [];
  }

  itemTapped(ev: any, item: {title: string, date: string}) {
    console.log(`itemTapped: ${item.title}`);
  }

  reload() {
    window.location.reload(true);
  }

}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
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
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
