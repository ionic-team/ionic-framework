import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

@Component({
  template: 'tab',
})
export class TabPage {}


@Component({
  templateUrl: 'page.html',
  styleUrls: ['style.css'],
  encapsulation: ViewEncapsulation.None
})
export class ApiDemoPage {
  root = TabPage;
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}

