import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-back-history',
  template: `<ion-router-outlet></ion-router-outlet>`,
  standalone: true,
  imports: [IonRouterOutlet],
})
export class BackHistoryComponent {}
