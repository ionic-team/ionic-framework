import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { IonicModule } from 'ionic-angular';

@Component({
  template: 'tab',
})
export class TabPage {}


@Component({
  templateUrl: 'main.html',
  styleUrls: ['style.css'],
  encapsulation: ViewEncapsulation.None
})
export class ApiDemoPage {
  root = TabPage;
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
    ApiDemoPage,
    TabPage
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
