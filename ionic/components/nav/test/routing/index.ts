import {RouteConfig, Location} from 'angular2/router';

import {App, Page, NavParams, ViewController} from 'ionic-angular';


@Page({templateUrl: 'view1.html'})
class View1Cmp {
  constructor(location: Location, viewCtrl: ViewController) {
    this.path = location.path();
    this.viewCtrl = viewCtrl;
    console.log(`View1Cmp, path: ${this.path}`);
  }
  onPageDidEnter() {
    this.windowHash = window.location.hash;
  }
}


@Page({templateUrl: 'view2.html'})
class View2Cmp {
  constructor(location: Location, viewCtrl: ViewController) {
    this.path = location.path();
    this.viewCtrl = viewCtrl;
    console.log(`View2Cmp, path: ${this.path}`);
  }
  onPageDidEnter() {
    this.windowHash = window.location.hash;
  }
}


@Page({templateUrl: 'view3.html'})
class View3Cmp {
  constructor(params: NavParams, location: Location, viewCtrl: ViewController) {
    this.id = params.get('id');
    this.path = location.path();
    this.viewCtrl = viewCtrl;
    console.log(`View3Cmp, path: ${this.path}, param id: ${this.id}`);
  }
  onPageDidEnter() {
    this.windowHash = window.location.hash;
  }
}


@App()
@RouteConfig([
  { path: '/', component: View1Cmp, as: 'First' },
  { path: '/2', component: View2Cmp, as: 'Second' },
  { path: '/3/:id', component: View3Cmp, as: 'Third' }
])
class InboxApp {
  constructor(location: Location) {
    this.location = location;
  }
}
