import { Component } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/angular/standalone';

/**
 * Parent with interactive buttons and nested outlet for child route modal.
 * See https://github.com/ionic-team/ionic-framework/issues/30700
 */
@Component({
  selector: 'app-modal-child-route-parent',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Parent Page with Nested Route</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <ion-button id="decrement-btn" (click)="decrement()">-</ion-button>
        <p id="background-action-count">{{ count }}</p>
        <ion-button id="increment-btn" (click)="increment()">+</ion-button>
      </div>
      <ion-router-outlet></ion-router-outlet>
    </ion-content>
  `,
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar],
})
export class ModalChildRouteParentComponent {
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}
