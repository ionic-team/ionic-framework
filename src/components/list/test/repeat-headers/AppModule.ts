import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  people = [
    {'name': 'Burt', 'components': [ 'all the things']},
    {'name': 'Mary', 'components': [ 'checkbox', 'content', 'form']},
    {'name': 'Albert', 'components': [ 'tabs']}
  ];
}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class E2EApp {
  rootPage = E2EPage;
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
