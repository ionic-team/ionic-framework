import { Component, NgModule } from '@angular/core';
import { IonicModule, Platform } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class ApiDemoPage {
  isIos: boolean;
  isAndroid: boolean;
  isWindows: boolean;

  constructor(platform: Platform) {
    this.isIos = platform.is('ios');
    this.isAndroid = platform.is('android');
    this.isWindows = platform.is('windows');
  }
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
