import {Component} from '@angular/core';
import {ionicBootstrap} from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  appType = "paid";
  safari = "links";
  news = "local";
  favorites = "recent";

  purchased = "all";
  mapStyle = "sat";
  teslaModels = "X";

  pet = "puppies";
  calendar = "day";
  proxy = "auto";
}

ionicBootstrap(ApiDemoApp);
