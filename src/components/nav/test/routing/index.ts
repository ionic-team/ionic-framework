import {Component} from '@angular/core';
import {Routes} from '@angular/router';
import {Location} from '@angular/common';
import {ionicBootstrap, NavParams, ViewController} from '../../../../../src';


@Component({templateUrl: 'view1.html'})
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


@Component({templateUrl: 'view2.html'})
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


@Component({templateUrl: 'view3.html'})
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


@Component({})
@Routes([
  { path: '/', component: View1Cmp },
  { path: '/2', component: View2Cmp },
  { path: '/3/:id', component: View3Cmp }
])
class E2EApp {
  constructor(private location: Location) {}
}

ionicBootstrap(E2EApp);
