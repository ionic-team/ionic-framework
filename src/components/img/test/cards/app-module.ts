import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';

@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  items = [];

  constructor() {
    for (var i = 0; i < 100; i++) {
      this.items.push(i);
    }
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
    IonicModule.forRoot(E2EApp, {
      imgWorkerUrl: '/dist/e2e/workers/ion-img-worker.js'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
