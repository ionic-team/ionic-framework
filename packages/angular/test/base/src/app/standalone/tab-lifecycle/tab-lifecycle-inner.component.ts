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
  selector: 'app-tab-lifecycle-inner',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Inner Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="go-outside-inner" routerLink="/standalone/tab-lifecycle-outside">Go Outside Tabs</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [RouterLink, IonButton, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar],
})
export class TabLifecycleInnerComponent implements ViewWillEnter, ViewDidEnter, ViewWillLeave, ViewDidLeave {
  ionViewWillEnter() {
    logLifecycle('inner:ionViewWillEnter');
  }

  ionViewDidEnter() {
    logLifecycle('inner:ionViewDidEnter');
  }

  ionViewWillLeave() {
    logLifecycle('inner:ionViewWillLeave');
  }

  ionViewDidLeave() {
    logLifecycle('inner:ionViewDidLeave');
  }
}
