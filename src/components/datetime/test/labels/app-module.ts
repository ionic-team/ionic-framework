import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';



@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  stacked1 = '1994-12-15T13:47:20.789';
  stacked2 = '1994-12-15T13:47:20.789';
  floating1 = '1995-04-15';
  floating2 = '1995-04-15';
  fixed1 = '2002-09-23T15:03:46.789';
  fixed2 = '2002-09-23T15:03:46.789';
  inline1 = '2005-06-17T11:06Z';
  inline2 = '2005-06-17T11:06Z';
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
