import {Component} from '@angular/core';
import {ionicBootstrap} from 'ionic-angular';

// Uses the list's demo but passes the demo var to change the title
@Component({
  templateUrl: '../list/main.html'
})
class ApiDemoApp {
  demo = "Item";
}

ionicBootstrap(ApiDemoApp);
