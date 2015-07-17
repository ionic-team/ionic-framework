import {Component, Directive} from 'angular2/angular2';

import {App, IonicView, Register} from 'ionic/ionic';

@IonicView({
  template: '<ion-navbar *navbar primary>' +
    '<ion-title>Heading</ion-title>' +
    '<ion-nav-items primary>' +
      '<button>P1</button>' +
    '</ion-nav-items>' +
    '<ion-nav-items secondary>' +
      '<button>S1</button>' +
      '<button icon><i class="icon ion-navicon"></i></button>' +
    '</ion-nav-items>' +
  '</ion-navbar>' +
  '<ion-content>' +
    `<ion-list>
      <ion-item>
        All Genres
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
      <ion-list inset>
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
