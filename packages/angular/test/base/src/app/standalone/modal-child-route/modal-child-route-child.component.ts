import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/angular/standalone';

/**
 * Child route component containing only the sheet modal with showBackdrop=false.
 * Verifies issue https://github.com/ionic-team/ionic-framework/issues/30700
 */
@Component({
  selector: 'app-modal-child-route-child',
  template: `
    <ion-modal
      [isOpen]="true"
      [breakpoints]="[0.2, 0.5, 0.7]"
      [initialBreakpoint]="0.5"
      [showBackdrop]="false"
    >
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-title>Modal in Child Route</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <p id="modal-content-loaded">Modal content loaded in child route</p>
        </ion-content>
      </ng-template>
    </ion-modal>
  `,
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonModal, IonTitle, IonToolbar],
})
export class ModalChildRouteChildComponent {}
