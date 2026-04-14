import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent, IonItem, IonLabel, IonRouterLink } from '@ionic/angular/standalone';

@Component({
  selector: 'app-swipe-gesture-disabled-main',
  template: `
    <ion-content>
      <ion-item routerLink="/standalone/swipe-gesture-disabled/details" id="swipe-disabled-details">
        <ion-label>Details</ion-label>
      </ion-item>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonItem, IonLabel, IonRouterLink, RouterModule]
})
export class SwipeGestureDisabledMainComponent {}
