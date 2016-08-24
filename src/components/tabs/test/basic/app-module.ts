import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, App, AlertController, ModalController, ViewController, Tab, Tabs } from '../../../..';

//
// Modal
//
@Component({
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">Cancel</button>
      </ion-buttons>

      <ion-title>
        Filter Sessions
      </ion-title>

      <ion-buttons end>
        <button ion-button (click)="dismiss()">Done</button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="outer-content">
    <ion-list>
      <ion-list-header>Tracks</ion-list-header>

      <ion-item *ngFor="let i of items">
        <ion-label>Toggle {{i}}</ion-label>
        <ion-toggle color="secondary"></ion-toggle>
      </ion-item>
    </ion-list>

    <ion-list>
      <button ion-item color="danger" detail-none>
        Reset All Filters
      </button>
      <button ion-item color="danger" detail-none (click)="appNavPop()">
        App Nav Pop
      </button>
    </ion-list>
  </ion-content>
  `
})
export class MyModal {
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
    <ion-header>
      <ion-navbar>
        <ion-title>Heart</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-list-header>
          Tab 1
        </ion-list-header>
        <ion-item *ngFor="let i of items">Item {{i}} {{i}} {{i}} {{i}}</ion-item>
      </ion-list>
      <p>
        <button ion-button (click)="selectPrevious()">Select Previous Tab</button>
      </p>
      <p>
        <button ion-button (click)="appNavPop()">App Nav Pop</button>
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
    <ion-header>
      <ion-navbar>
        <ion-title>Schedule</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item-sliding *ngFor="let session of sessions" #slidingItem>
          <ion-item>
            <h3>{{session.name}} {{session.name}} {{session.name}}</h3>
            <p>{{session.location}} {{session.location}} {{session.location}}</p>
          </ion-item>
          <ion-item-options>
            <button ion-button color="primary">Speaker<br>Info</button>
            <button ion-button color="secondary">Add to<br>Favorites</button>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <p>
        <button ion-button (click)="selectPrevious()">Select Previous Tab</button>
      </p>
      <p>
        <button ion-button (click)="appNavPop()">App Nav Pop</button>
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
    <ion-header>
      <ion-navbar>
        <button ion-button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Stopwatch</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <h2>Tab 3</h2>
      <p>
        <button ion-button (click)="presentAlert()">Present Alert</button>
        <button ion-button (click)="presentModal()">Present Modal</button>
      </p>
      <p>
        <button ion-button (click)="selectPrevious()">Select Previous Tab</button>
      </p>
      <p>
        <button ion-button (click)="appNavPop()">App Nav Pop</button>
      </p>
    </ion-content>
    `
})
export class Tab3 {
  constructor(private alertCtrl: AlertController, private modalCtrl: ModalController, private tabs: Tabs, private app: App) {}

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert Title!',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentModal() {
    this.modalCtrl.create(MyModal).present();
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
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
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
      <ion-tab tabTitle="Stopwatch" tabIcon="logo-facebook" [root]="root3"></ion-tab>
      <ion-tab tabTitle="Messages" tabIcon="chatboxes" [root]="root1"></ion-tab>
      <ion-tab tabTitle="My Profile" tabIcon="person" [root]="root2"></ion-tab>
    </ion-tabs>
  `
})
export class TabsPage {
  root1 = Tab1;
  root2 = Tab2;
  root3 = Tab3;

  onChange(ev: Tab) {
    console.log('Changed tab', ev);
  }

  onSelect(ev: Tab) {
    console.log('Selected tab', ev);
  }
}

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class E2EApp {
  root = TabsPage;
}

@NgModule({
  declarations: [
    E2EApp,
    MyModal,
    Tab1,
    Tab2,
    Tab3,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    MyModal,
    Tab1,
    Tab2,
    Tab3,
    TabsPage
  ]
})
export class AppModule {}
