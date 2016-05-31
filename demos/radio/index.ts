import {Component} from '@angular/core';
import {ionicBootstrap} from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  isDisabled = true;
}

ionicBootstrap(ApiDemoApp);
