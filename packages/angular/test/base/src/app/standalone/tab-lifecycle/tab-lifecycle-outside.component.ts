import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonRouterLink,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

@Component({
  selector: 'app-tab-lifecycle-outside',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone/tab-lifecycle/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Outside Tabs</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p>Outside the tabs</p>
      <ion-button id="go-to-settings" routerLink="/standalone/tab-lifecycle/settings">Go to Settings Tab</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [RouterLink, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar],
})
export class TabLifecycleOutsideComponent {}
