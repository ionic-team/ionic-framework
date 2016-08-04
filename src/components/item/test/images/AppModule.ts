import { Component, NgModule } from '@angular/core';
import { ionicBootstrap, IonicModule } from '../dist';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
class E2EApp {
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
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
