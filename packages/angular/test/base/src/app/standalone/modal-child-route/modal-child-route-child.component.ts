import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/angular/standalone';

/**
 * Child component that ONLY contains the modal.
 *
 * This mimics the EXACT structure from issue #30700 reproduction where:
 * - The PARENT page has the interactive content (buttons)
 * - The CHILD route (this component) contains ONLY the modal
 *
 * The structure is:
 * - ion-app > ion-router-outlet (root) > PARENT (has buttons + nested outlet) > ion-router-outlet (nested) > THIS COMPONENT (has modal)
 *
 * The bug is: when this modal opens, the buttons in the PARENT become non-interactive
 * even though showBackdrop=false should allow background interaction.
 *
 * Related issue: https://github.com/ionic-team/ionic-framework/issues/30700
 */
@Component({
  selector: 'app-modal-child-route-child',
  template: `
    <!-- This child route component contains ONLY the modal, which opens immediately -->
    <!-- The interactive content (buttons) are in the PARENT component -->

    <!-- INLINE modal with showBackdrop=false - parent content should be interactive -->
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
          <p>The +/- buttons in the parent should be clickable!</p>
        </ion-content>
      </ng-template>
    </ion-modal>
  `,
  standalone: true,
  imports: [CommonModule, IonButton, IonContent, IonHeader, IonModal, IonTitle, IonToolbar],
})
export class ModalChildRouteChildComponent {}
