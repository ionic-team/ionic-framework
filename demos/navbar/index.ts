import {Component} from '@angular/core';
import {ionicBootstrap} from 'ionic-angular';


// Use the toolbar demo but pass in the demo name to change the title
@Component({
  templateUrl: '../toolbar/main.html'
})
class ApiDemoApp {
  demo = "Navbar";
  favorites = "recent";
  apps = "free";
}

ionicBootstrap(ApiDemoApp);
