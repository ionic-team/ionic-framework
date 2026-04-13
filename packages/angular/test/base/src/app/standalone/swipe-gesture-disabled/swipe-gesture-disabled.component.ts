import { Component } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-swipe-gesture-disabled',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone"></ion-back-button>
        </ion-buttons>
        <ion-title>Swipe Gesture Disabled</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-router-outlet [swipeGesture]="false"></ion-router-outlet>
    </ion-content>
  `,
  standalone: true,
  imports: [IonBackButton, IonButtons, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar]
})
export class SwipeGestureDisabledComponent {}
