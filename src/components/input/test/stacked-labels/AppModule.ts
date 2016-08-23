import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class PageOne {
  gender = '';
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = PageOne;
}

@NgModule({
  declarations: [
    E2EApp,
    PageOne
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    PageOne
  ]
})
export class AppModule {}
