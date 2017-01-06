import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Platform } from '../../../ionic-angular';


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  isAndroid: boolean = false;
  selectedSegment: string = 'hot';

  constructor(platform: Platform) {
    this.isAndroid = platform.is('android');
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