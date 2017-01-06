import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { IonicApp, IonicModule, Platform } from '../../../ionic-angular';

@Component({
  template: `
    <ion-header>
      <ion-navbar [color]="isAndroid ? 'royal' : 'primary'">
        <ion-title>Tabs</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
    </ion-content>
`})
export class TabPage {
  isAndroid: boolean = false;

  constructor(platform: Platform) {
    this.isAndroid = platform.is('android');
  }
}


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  root = TabPage;

  isAndroid: boolean = false;

  constructor(platform: Platform) {
    this.isAndroid = platform.is('android');
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>',
  selector: 'api-demo-app'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}


@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage,
    TabPage
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage,
    TabPage
  ]
})
export class AppModule {}
