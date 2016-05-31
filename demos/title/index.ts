import {Component} from '@angular/core';
import {ionicBootstrap} from 'ionic-angular';


// Use the toolbar demo but pass in the demo name to change the title
// this will also hide some of the toolbars that don't use `ion-title`
@Component({
  templateUrl: '../toolbar/main.html'
})
class ApiDemoApp {
  demo = "Title";
  favorites = "recent";
  apps = "free";
}

ionicBootstrap(ApiDemoApp);
