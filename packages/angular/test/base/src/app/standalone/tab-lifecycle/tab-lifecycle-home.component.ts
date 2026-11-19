import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonRouterLink,
  IonTitle,
  IonToolbar,
  ViewDidEnter,
  ViewDidLeave,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';

import { logLifecycle } from './lifecycle-log';

@Component({
  selector: 'app-tab-lifecycle-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Home Tab</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="go-outside-home" routerLink="/standalone/tab-lifecycle-outside">Go Outside Tabs</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [RouterLink, IonButton, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar],
})
export class TabLifecycleHomeComponent implements ViewWillEnter, ViewDidEnter, ViewWillLeave, ViewDidLeave {
  ionViewWillEnter() {
    logLifecycle('home:ionViewWillEnter');
  }

  ionViewDidEnter() {
    logLifecycle('home:ionViewDidEnter');
  }

  ionViewWillLeave() {
    logLifecycle('home:ionViewWillLeave');
  }

  ionViewDidLeave() {
    logLifecycle('home:ionViewDidLeave');
  }
}
