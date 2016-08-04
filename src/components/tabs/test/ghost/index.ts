import { Component, ContentChild, QueryList, ViewChildren } from '@angular/core';
import { ionicBootstrap, NavController, Tab } from '../../../../../src';


//
// Tab 1
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Heart</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <h2>Tab 1</h2>
    </ion-content>
    `
})
class Tab1 {}

//
// Tab 2
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Star</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <h2>Tab 2</h2>
    </ion-content>
    `
})
class Tab2 {}

//
// Tab 3
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Stopwatch</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <h2>Tab 3</h2>
    </ion-content>
    `
})
class Tab3 {}

//
// Tab 3
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Quesarito</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <h2>Quesarito</h2>
    </ion-content>
    `
})
class QuesaritoPage {}

@Component({
  template: `
    <ion-menu [content]="content">
      <ion-header>
        <ion-toolbar secondary>
          <ion-title>Secret Menu</ion-title>
        </ion-toolbar>
      </ion-header>
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
class TabsPage {
  root1 = Tab1;
  root2 = Tab2;
  root3 = Tab3;

  @ViewChildren(Tab) tab: QueryList<Tab>;

  ngAfterViewInit() {
    console.log('Tab', this.tab);
    console.log(this.tab.first.setRoot);
  }

  openPage(which: string) {
    let pages = {
      'quesarito': QuesaritoPage
    };

    this.tab.first.setRoot(pages[which]);
  }

}

ionicBootstrap(TabsPage);
