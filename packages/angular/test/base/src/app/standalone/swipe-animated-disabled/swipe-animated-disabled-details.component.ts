import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-swipe-animated-disabled-details',
  template: `
    <ion-content>
      <div>Details (animated disabled)</div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent]
})
export class SwipeAnimatedDisabledDetailsComponent {}
