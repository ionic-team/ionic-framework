import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  selector: 'app-back-history-wrapped',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone/back-history"></ion-back-button>
        </ion-buttons>
        <ion-title>Wrapped Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="wrapped-go-to-d" routerLink="/standalone/back-history/d">Go to D</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar, RouterModule],
})
export class BackHistoryWrappedComponent {}
