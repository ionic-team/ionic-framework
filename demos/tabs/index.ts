import {Component, ViewEncapsulation} from '@angular/core';
import {ionicBootstrap} from 'ionic-angular';


@Component({
  templateUrl: 'main.html',
  styleUrls: ['style.css'],
  encapsulation: ViewEncapsulation.None
})
class ApiDemoApp {}

ionicBootstrap(ApiDemoApp);
