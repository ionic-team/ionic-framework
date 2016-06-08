import {Component} from '@angular/core';
import {ionicBootstrap, NavController, App, Alert, Modal, ViewController, Tab, Tabs} from '../../../../../src';

//
// Modal
//
@Component({
  template: `
  <ion-toolbar>
    <ion-buttons start>
      <button (click)="dismiss()">Cancel</button>
    </ion-buttons>

    <ion-title>
      Filter Sessions
    </ion-title>

    <ion-buttons end>
      <button (click)="dismiss()">Done</button>
    </ion-buttons>
  </ion-toolbar>

  <ion-content class="outer-content">
    <ion-list>
      <ion-list-header>Tracks</ion-list-header>

      <ion-item *ngFor="let i of items">
        <ion-label>Toggle {{i}}</ion-label>
        <ion-toggle secondary></ion-toggle>
      </ion-item>
    </ion-list>

    <ion-list>
      <button ion-item danger detail-none>
        Reset All Filters
      </button>
      <button ion-item danger detail-none (click)="appNavPop()">
        App Nav Pop
      </button>
    </ion-list>
  </ion-content>
  `
})
class MyModal {
  items: any[] = [];

  constructor(private viewCtrl: ViewController, private app: App) {
    for (var i = 1; i <= 10; i++) {
      this.items.push(i);
    }
  }

  dismiss() {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss();
  }

  appNavPop() {
    this.app.navPop();
  }
}

//
// Tab 1
//
@Component({
  template: `
    <ion-navbar *navbar>
      <ion-title>Heart</ion-title>
    </ion-navbar>
    <ion-content>
      <ion-list>
        <ion-list-header>
          Tab 1
        </ion-list-header>
        <ion-item *ngFor="let i of items">Item {{i}} {{i}} {{i}} {{i}}</ion-item>
      </ion-list>
      <p>
        <button (click)="selectPrevious()">Select Previous Tab</button>
      </p>
      <p>
        <button (click)="appNavPop()">App Nav Pop</button>
      </p>
    </ion-content>
    `
})
export class Tab1 {
  items: any[] = [];

  constructor(private tabs: Tabs, private app: App) {
    for (var i = 1; i <= 250; i++) {
      this.items.push(i);
    }
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}

//
// Tab 2
//
@Component({
  template: `
    <ion-navbar *navbar>
      <ion-title>Schedule</ion-title>
    </ion-navbar>
    <ion-content>
      <ion-list>
        <ion-item-sliding *ngFor="let session of sessions" #slidingItem>
          <ion-item>
            <h3>{{session.name}} {{session.name}} {{session.name}}</h3>
            <p>{{session.location}} {{session.location}} {{session.location}}</p>
          </ion-item>
          <ion-item-options>
            <button primary>Speaker<br>Info</button>
            <button secondary>Add to<br>Favorites</button>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <p>
        <button (click)="selectPrevious()">Select Previous Tab</button>
      </p>
      <p>
        <button (click)="appNavPop()">App Nav Pop</button>
      </p>
    </ion-content>
  `
})
export class Tab2 {
  sessions: any[] = [];

  constructor(private tabs: Tabs, private app: App) {
    for (var i = 1; i <= 250; i++) {
      this.sessions.push({
        name: 'Name ' + i,
        location: 'Location: ' + i
      });
    }
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}

//
// Tab 3
//
@Component({
  template: `
    <ion-navbar *navbar>
      <button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>Stopwatch</ion-title>
    </ion-navbar>
    <ion-content padding>
      <h2>Tab 3</h2>
      <p>
        <button (click)="presentAlert()">Present Alert</button>
        <button (click)="presentModal()">Present Modal</button>
      </p>
      <p>
        <button (click)="selectPrevious()">Select Previous Tab</button>
      </p>
      <p>
        <button (click)="appNavPop()">App Nav Pop</button>
      </p>
    </ion-content>
    `
})
export class Tab3 {
  constructor(private nav: NavController, private tabs: Tabs, private app: App) {}

  presentAlert() {
    let alert = Alert.create({
      title: 'Alert Title!',
      buttons: ['Dismiss']
    });
    this.nav.present(alert);
  }

  presentModal() {
    let modal = Modal.create(MyModal);
    this.nav.present(modal);
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}


@Component({
  template: `
    <ion-menu [content]="content">
      <ion-toolbar secondary>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
      <ion-content>
        <ion-list>
          <button ion-item menuClose detail-none>
            Close Menu
          </button>
        </ion-list>
      </ion-content>
    </ion-menu>

    <ion-tabs #content (ionChange)="onChange($event)">
      <ion-tab tabTitle="Plain List" tabIcon="star" [root]="root1" (ionSelect)="onSelect($event)"></ion-tab>
      <ion-tab tabTitle="Schedule" tabIcon="globe" [root]="root2"></ion-tab>
      <ion-tab tabTitle="Stopwatch" tabIcon="stopwatch" [root]="root3"></ion-tab>
    </ion-tabs>
  `
})
export class TabsPage {
  root1 = Tab1;
  root2 = Tab2;
  root3 = Tab3;

  onChange(ev: Tab) {
    console.log("Changed tab", ev);
  }

  onSelect(ev: Tab) {
    console.log("Selected tab", ev);
  }
}

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class E2EApp {
  root = TabsPage;
}

ionicBootstrap(E2EApp);
