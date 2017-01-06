import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { IonicApp, IonicModule } from '../../../ionic-angular';


@Component({
  template: '<div>johnny utah</div>',
  selector: 'tab-page'
})
export class TabPage {}


@Component({
  templateUrl: 'page.html',
  selector: 'api-demo-page',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      ion-tabs {
        margin-bottom: 20px;
      }
    `,
    `
      ion-tabs,
      ion-tabs .tabbar {
        position: relative;
        top: auto;
        height: auto;
        visibility: visible;
        opacity: 1;
      }
    `
  ]
})
export class ApiDemoPage {
  root = TabPage;
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
