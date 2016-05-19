import {Routes} from '@angular/router';
import {Location} from '@angular/common';

import {App, Page, NavParams, ViewController} from '../../../../../ionic';


@Page({templateUrl: 'view1.html'})
class View1Cmp {
  path: string;
  windowHash: string;

  constructor(location: Location, private viewCtrl: ViewController) {
    this.path = location.path();
    console.log(`View1Cmp, path: ${this.path}`);
  }

  onPageDidEnter() {
    this.windowHash = window.location.hash;
  }
}


@Page({templateUrl: 'view2.html'})
class View2Cmp {
  path: string;
  windowHash: string;

  constructor(location: Location, private viewCtrl: ViewController) {
    this.path = location.path();
    console.log(`View2Cmp, path: ${this.path}`);
  }

  onPageDidEnter() {
    this.windowHash = window.location.hash;
  }
}


@Page({templateUrl: 'view3.html'})
class View3Cmp {
  id: string;
  path: string;
  windowHash: string;

  constructor(params: NavParams, location: Location, private viewCtrl: ViewController) {
    this.id = params.get('id');
    this.path = location.path();
    console.log(`View3Cmp, path: ${this.path}, param id: ${this.id}`);
  }

  onPageDidEnter() {
    this.windowHash = window.location.hash;
  }
}


@App()
@Routes([
  { path: '/', component: View1Cmp },
  { path: '/2', component: View2Cmp },
  { path: '/3/:id', component: View3Cmp }
])
class InboxApp {
  constructor(private location: Location) {}
}
