import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../dist';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  dynamicColor: string = 'secondary';
}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
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
