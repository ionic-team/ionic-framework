import { Component } from '@angular/core';
import { Config, Tab } from '../../../../../..';

import { Tab1 } from '../../components/tab1';
import { Tab2 } from '../../components/tab2';
import { Tab3 } from '../../components/tab3';

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

    <ion-tabs #content (ionChange)="onChange($event)" [color]="myColor">
      <ion-tab tabTitle="Plain List" tabIcon="star" [root]="root1" (ionSelect)="onSelect($event)"></ion-tab>
      <ion-tab tabTitle="Schedule" tabIcon="globe" [root]="root2"></ion-tab>
      <ion-tab tabTitle="Stopwatch" tabIcon="logo-facebook" [root]="root3"></ion-tab>
      <ion-tab tabTitle="Messages" tabIcon="md-chatboxes" [root]="root1"></ion-tab>
      <ion-tab tabTitle="My Profile" tabIcon="ios-person" [root]="root2"></ion-tab>
    </ion-tabs>
  `
})
export class TabsPage {
  root1 = Tab1;
  root2 = Tab2;
  root3 = Tab3;
  myColor: string;

  constructor(config: Config) {
    this.myColor = (config.get('mode') !== 'ios') ? 'primary' : null;
  }

  onChange(ev: Tab) {
    console.log('Changed tab', ev);
  }

  onSelect(ev: Tab) {
    console.log('Selected tab', ev);
  }
}
