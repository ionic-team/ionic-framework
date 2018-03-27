import { Component } from '@angular/core';

import { PopoverController } from '@ionic/angular';
import { PopoverPageToPresent } from './popover-page-to-present';

@Component({
  selector: 'app-popover-page',
  template: `
  <ion-app>
      <ion-header>
        <ion-toolbar>
          <ion-title>Popover</ion-title>
          <ion-buttons slot="primary">
            <ion-button (click)="clickMe()">
              No event passed
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content padding>
        <ion-button (click)="clickMe($event)">Open Basic Popover</ion-button>
      </ion-content>
</ion-app>
  `
})
export class PopoverPageComponent {

  constructor(private popoverController: PopoverController) {
  }

  async clickMe(event: Event) {
    const popover = await this.popoverController.create({
      component: PopoverPageToPresent,
      ev: event
    });
    return popover.present();
  }

}
