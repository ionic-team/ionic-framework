import { Component } from '@angular/core';

import { PopoverController } from '@ionic/angular';
import { PopoverPageToPresent } from './popover-page-to-present';

@Component({
  selector: 'app-popover-page',
  template: `
  <ion-app>
    <ion-page class="show-page">
      <ion-header>
        <ion-toolbar>
          <ion-title>Test</ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="clickMe()">
              No event passed
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content padding>
        <ion-button (click)="clickMe($event)">Open Basic Popover</ion-button>
      </ion-content>
    </ion-page>
</ion-app>
  `
})
export class PopoverPageComponent {

  constructor(private popoverController: PopoverController) {
  }

  clickMe(event: Event) {
    const popover = this.popoverController.create({
      component: PopoverPageToPresent,
      ev: event
    });
    return popover.present();
  }

}
