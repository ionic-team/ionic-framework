import { Component } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/angular/standalone';

/**
 * Parent component that contains:
 * 1. Interactive content (buttons) that should remain clickable
 * 2. A nested ion-router-outlet where the child route with the modal will render
 *
 * This mimics the EXACT structure from issue #30700 reproduction:
 * - Parent page has buttons (+/-)
 * - Parent page has a nested IonRouterOutlet
 * - Child route (rendered in that outlet) contains ONLY the modal
 *
 * The bug is: when the modal opens in the child route, the buttons in THIS
 * parent component become non-interactive even with showBackdrop=false.
 *
 * Related issue: https://github.com/ionic-team/ionic-framework/issues/30700
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
      <!-- These buttons are in the PARENT and should be clickable when modal is open in CHILD -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <ion-button id="decrement-btn" (click)="decrement()">-</ion-button>
        <p id="background-action-count">{{ count }}</p>
        <ion-button id="increment-btn" (click)="increment()">+</ion-button>
      </div>

      <p>The modal will be rendered from a child route below:</p>

      <!-- Nested router outlet - child route with modal renders here -->
      <ion-router-outlet id="child-router-outlet"></ion-router-outlet>
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
