import {Component, Directive} from 'angular2/angular2';

import {App, IonicView, Register} from 'ionic/ionic';

@IonicView({
  template: '<ion-navbar *navbar primary>' +
    '<ion-title>Heading</ion-title>' +
    '<ion-nav-items primary>' +
      '<button icon><i class="icon ion-navicon"></i></button>' +
    '</ion-nav-items>' +
    '<ion-nav-items secondary>' +
      '<button><ion-icon md="ion-android-search" ios="ion-ios-search-strong"></i></button>' +
      '<button><i class="icon ion-android-more-vertical"></i></button>' +
    '</ion-nav-items>' +
  '</ion-navbar>' +
  '<ion-content>' +
    `<ion-list>
      <ion-item>
        <h3>All Genres</h3>
        <h4>Jan 17 2015</h4>
      </ion-item>
      <ion-item>
        Alternative
      </ion-item>
      <ion-item>
        Blues
      </ion-item>
    </ion-list>
    ` +
  '</ion-content>'
})
export class FirstPage {
  constructor() {
  }
}

@App({
  template: `<link href='http://fonts.googleapis.com/css?family=Roboto:400,300,700,500' rel='stylesheet' type='text/css'>
    <ion-aside id="menu" side="left" [content]="content">
      <ion-toolbar primary><ion-title>Menu</ion-title></ion-toolbar>
      <ion-list>
        <ion-item>Your Profile</ion-item>
        <ion-item>Playlists</ion-item>
        <ion-item>Artists</ion-item>
      </ion-list>
    </ion-aside>
    <ion-nav #content></ion-nav>`,
  routes: [
    {
      path: '/first',
      component: FirstPage,
      root: true
    }
  ]
})
class MyApp {
  constructor() {
  }
}
