import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-router-outlet-query-params-details',
  template: `
    <ion-content>
      <h1>Details</h1>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent],
})
export class RouterOutletQueryParamsDetailsComponent {}
