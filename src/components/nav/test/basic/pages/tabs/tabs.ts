import { Component } from '@angular/core';
import { IonicPage, Tab } from '../../../../../..';

@IonicPage({
  name: 'tabs'
})
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
      <ion-tab tabUrlPath="plain" tabTitle="Plain List" tabIcon="star" [root]="root1" (ionSelect)="onSelect($event)"></ion-tab>
      <ion-tab tabTitle="Schedule" tabIcon="globe" [root]="root2"></ion-tab>
      <ion-tab tabTitle="Stopwatch" tabIcon="logo-facebook" [root]="root3"></ion-tab>
      <ion-tab tabTitle="Messages" tabIcon="chatboxes" [root]="root1"></ion-tab>
      <ion-tab tabTitle="My Profile" tabIcon="person" [root]="root2"></ion-tab>
    </ion-tabs>
  `
})
export class TabsPage {
  root1 = 'tab-one';
  root2 = 'tab-two';
  root3 = 'tab-three';

  onChange(ev: Tab) {
    console.log('Changed tab', ev);
  }

  onSelect(ev: Tab) {
    console.log('Selected tab', ev);
  }
}
