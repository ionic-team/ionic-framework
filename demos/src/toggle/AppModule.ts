import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

@Component({
  templateUrl: 'main.html'
})
export class ApiDemoPage {
  data = {
    frodo: true,
    sam: false,
    eowyn: true,
    legolas: true,
    gimli: false,
    saruman: true,
    gandalf: true,
    arwen: false,
    boromir: false,
    gollum: true,
    galadriel: false
  };
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
