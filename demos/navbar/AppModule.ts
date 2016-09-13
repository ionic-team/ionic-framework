import { Component, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

// Use the toolbar demo but pass in the demo name to change the title
@Component({
  templateUrl: '../toolbar/main.html'
})
export class ApiDemoPage {
  demo = "Navbar";
  favorites = "recent";
  apps = "free";
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
