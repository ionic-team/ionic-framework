import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent, IonItem, IonLabel, IonRouterLink } from '@ionic/angular';

@Component({
  selector: 'app-swipe-animated-disabled-main',
  template: `
    <ion-content>
      <ion-item routerLink="/standalone/swipe-animated-disabled/details" id="swipe-animated-disabled-details">
        <ion-label>Details</ion-label>
      </ion-item>
      <p>ionViewWillEnter: <span id="ionViewWillEnter">{{ willEnter() }}</span></p>
      <p>ionViewDidEnter: <span id="ionViewDidEnter">{{ didEnter() }}</span></p>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonItem, IonLabel, IonRouterLink, RouterModule]
})
export class SwipeAnimatedDisabledMainComponent {
  willEnter = signal(0);
  didEnter = signal(0);

  ionViewWillEnter() {
    this.willEnter.update((n) => n + 1);
  }

  ionViewDidEnter() {
    this.didEnter.update((n) => n + 1);
  }
}
