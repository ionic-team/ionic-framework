import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, NavController, NavParams } from '..';


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  myParam: string = '';

  constructor(public navCtrl: NavController) {}

  pushParams() {
    this.navCtrl.push(PushPage, { 'myParam': this.myParam });
  }
}

@Component({
  templateUrl: 'push-page.html'
})
export class PushPage {
  myParam: string;

  constructor(params: NavParams) {
    this.myParam = params.get('myParam');
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
    ApiDemoPage,
    PushPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage,
    PushPage
  ]
})
export class AppModule {}
