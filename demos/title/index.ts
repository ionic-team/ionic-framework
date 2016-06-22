import { Component } from '@angular/core';
import { ionicBootstrap } from 'ionic-angular';


// Use the toolbar demo but pass in the demo name to change the title
// this will also hide some of the toolbars that don't use `ion-title`
@Component({
  templateUrl: '../toolbar/main.html'
})
class ApiDemoPage {
  demo = "Title";
  favorites = "recent";
  apps = "free";
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);
