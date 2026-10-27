import { Component, signal } from '@angular/core';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-swipe-animated-disabled',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone"></ion-back-button>
        </ion-buttons>
        <ion-title>Swipe Animated Disabled</ion-title>
        <ion-buttons slot="end">
          <ion-button id="toggle-animated" (click)="animated.set(!animated())">
            animated: <span id="animated-value">{{ animated() }}</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-router-outlet [animated]="animated()"></ion-router-outlet>
    </ion-content>
  `,
  standalone: true,
  imports: [IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar]
})
export class SwipeAnimatedDisabledComponent {
  animated = signal(false);
}
