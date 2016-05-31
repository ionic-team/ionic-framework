import {Component} from '@angular/core';
import {ionicBootstrap} from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  demo = "Toolbar";
  favorites = "recent";
  apps = "free";
}

ionicBootstrap(ApiDemoApp);
