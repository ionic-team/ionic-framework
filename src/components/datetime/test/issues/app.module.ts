import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../../../ionic-angular';



@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  tokyoTime = this.calculateTime(1);

  calculateTime(offset: number) {
    // create Date object for current location
    const d = new Date();

    // create new Date object for different city
    // using supplied offset
    const nd = new Date(d.getTime() + (3600000 * offset));

    return nd.toISOString();
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
    E2EPage
  ]
})
export class AppModule {}
