import { Component } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-swipe-gesture-disabled-details',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone/swipe-gesture-disabled"></ion-back-button>
        </ion-buttons>
        <ion-title>Details</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div>Details (swipe disabled)</div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar]
})
export class SwipeGestureDisabledDetailsComponent {}
