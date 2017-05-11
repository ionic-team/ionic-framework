import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../..';

//
// Tab 1
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Speakers</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-list-header>
          Tab 1
        </ion-list-header>
        <ion-item *ngFor="let i of items">Item {{i}} {{i}} {{i}} {{i}}</ion-item>
      </ion-list>
    </ion-content>
    `
})
export class Tab1 {
  items: any[] = [];

  constructor() {
    for (var i = 1; i <= 250; i++) {
      this.items.push(i);
    }
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
      <ion-toolbar>
        <ion-searchbar></ion-searchbar>
      </ion-toolbar>
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
    </ion-content>
  `
})
export class Tab2 {
  sessions: any[] = [];

  constructor() {
    for (var i = 1; i <= 250; i++) {
      this.sessions.push({
        name: 'Name ' + i,
        location: 'Location: ' + i
      });
    }
  }
}

//
// Tab 3
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Map</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <h2>Tab 3</h2>
    </ion-content>
    `
})
export class Tab3 {
  constructor() {}
}


@Component({
  template: `
    <ion-tabs>
      <ion-tab tabTitle="Speakers" tabIcon="person" [root]="root1"></ion-tab>
      <ion-tab tabTitle="Schedule" tabIcon="globe" [root]="root2"></ion-tab>
      <ion-tab tabTitle="Map" tabIcon="map" [root]="root3"></ion-tab>
    </ion-tabs>
  `
})
export class TabsPage {
  root1 = Tab1;
  root2 = Tab2;
  root3 = Tab3;
}

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class AppComponent {
  root = TabsPage;
}

@NgModule({
  declarations: [
    AppComponent,
    Tab1,
    Tab2,
    Tab3,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {
      tabsPlacement: 'top'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    Tab1,
    Tab2,
    Tab3,
    TabsPage
  ]
})
export class AppModule {}
