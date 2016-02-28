  import {App, Page, NavController, Tab} from 'ionic-angular';

import {ContentChild, QueryList, ViewChildren} from 'angular2/core';

//
// Tab 1
//
@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Heart</ion-title>
    </ion-navbar>
    <ion-content padding>
      <h2>Tab 1</h2>
    </ion-content>
    `
})
class Tab1 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}

//
// Tab 2
//
@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Star</ion-title>
    </ion-navbar>
    <ion-content padding>
      <h2>Tab 2</h2>
    </ion-content>
    `
})
class Tab2 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}

//
// Tab 3
//
@Page({
  template: `
    <ion-navbar *navbar>
      <button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>Stopwatch</ion-title>
    </ion-navbar>
    <ion-content padding>
      <h2>Tab 3</h2>
    </ion-content>
    `
})
class Tab3 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}

//
// Tab 3
//
@Page({
  template: `
    <ion-navbar *navbar>
      <button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>Quesarito</ion-title>
    </ion-navbar>
    <ion-content padding>
      <h2>Quesarito</h2>
    </ion-content>
    `
})
class QuesaritoPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}

@App({
  template: `
    <ion-menu [content]="content">
      <ion-toolbar secondary>
        <ion-title>Secret Menu</ion-title>
      </ion-toolbar>
      <ion-content>
        <ion-list>
          <button ion-item menuClose detail-none (click)="openPage('quesarito')">
            Quesarito
          </button>
        </ion-list>
      </ion-content>
    </ion-menu>

    <ion-tabs #content>
      <ion-tab tabTitle="Heart" tabIcon="heart" [root]="root1" #tab1></ion-tab>
      <ion-tab tabTitle="Star" tabIcon="star" [root]="root2"></ion-tab>
      <ion-tab tabTitle="Stopwatch" tabIcon="stopwatch" [root]="root3"></ion-tab>
    </ion-tabs>
  `
})
export class TabsPage {
  @ViewChildren(Tab) tab : QueryList<Tab>;

  ngAfterViewInit() {
    console.log('Tab', this.tab);
    console.log(this.tab.first.setRoot);
  }

  openPage(which) {
    let pages = {
      'quesarito': QuesaritoPage
    };

    this.tab.first.setRoot(pages[which])
  }

  constructor() {

    this.root1 = Tab1;
    this.root2 = Tab2;
    this.root3 = Tab3;
  }
  ngOnInit() {
  }
}
