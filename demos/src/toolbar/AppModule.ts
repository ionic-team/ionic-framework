import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

@Component({
  templateUrl: 'main.html'
})
export class ApiDemoPage {
  demo = 'Toolbar';
  favorites = 'recent';
  apps = 'free';
}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
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
