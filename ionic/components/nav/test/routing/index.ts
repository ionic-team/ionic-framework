import {RouteConfig, Location} from 'angular2/router';

import {App, IonicView, NavParams, ViewItem} from 'ionic/ionic';


@IonicView({templateUrl: 'view1.html'})
class View1Cmp {
  constructor(location: Location, viewItem: ViewItem) {
    this.path = location.path();
    this.viewItem = viewItem;
    console.log(`View1Cmp, path: ${this.path}`);
  }
  viewDidEnter() {
    this.windowHash = window.location.hash;
  }
}


@IonicView({templateUrl: 'view2.html'})
class View2Cmp {
  constructor(location: Location, viewItem: ViewItem) {
    this.path = location.path();
    this.viewItem = viewItem;
    console.log(`View2Cmp, path: ${this.path}`);
  }
  viewDidEnter() {
    this.windowHash = window.location.hash;
  }
}


@IonicView({templateUrl: 'view3.html'})
class View3Cmp {
  constructor(params: NavParams, location: Location, viewItem: ViewItem) {
    this.id = params.get('id');
    this.path = location.path();
    this.viewItem = viewItem;
    console.log(`View3Cmp, path: ${this.path}, param id: ${this.id}`);
  }
  viewDidEnter() {
    this.windowHash = window.location.hash;
  }
}


@App()
@RouteConfig([
  { path: '/', component: View1Cmp, as: 'first' },
  { path: '/second', component: View2Cmp, as: 'second' },
  { path: '/third/:id', component: View3Cmp, as: 'third' }
])
class InboxApp {
  constructor(location: Location) {
    this.location = location;
  }
}
