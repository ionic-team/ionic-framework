import { Component } from '@angular/core';

import { ionicBootstrap } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoPage {
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


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);
