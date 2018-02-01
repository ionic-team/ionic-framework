import { Component } from '@angular/core';

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-virtual-scroll-page',
  template: `
  <ion-app>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Test</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content padding>
        <ion-virtual-scroll [items]="items">
          <ion-item *virtualItem="let item">{{item}}</ion-item>
        </ion-virtual-scroll>
      </ion-content>
    </ion-page>
  </ion-app>`
})
export class VirtualScrollPageComponent {
  items: string[];
  constructor() {
    this.items = Array.from({length: 1000}, (_, i) => i + '');
  }

}
