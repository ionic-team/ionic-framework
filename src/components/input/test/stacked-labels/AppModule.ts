import { Component, NgModule } from '@angular/core';
import { IonicModule } from '../../../dist';


@Component({
  templateUrl: 'main.html'
})
export class PageOne {}


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
  entryComponents: [
    E2EApp,
    PageOne
  ]
})
export class AppModule {}
