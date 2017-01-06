import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../ionic-angular';


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>',
  styleUrls: ['styles.scss']
})
export class ApiDemoApp {
  root = ApiDemoPage;
}


@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage
  ]
})
export class AppModule {}
