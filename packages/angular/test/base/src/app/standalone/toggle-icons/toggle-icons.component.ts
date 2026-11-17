import { Component } from '@angular/core';
import { IonContent, IonToggle } from '@ionic/angular';

/**
 * Binds the toggle icon inputs as Angular properties so a missing
 * input on the standalone IonToggle fails the template compile.
 */
@Component({
  selector: 'app-toggle-icons',
  template: `
    <ion-content>
      <ion-toggle id="custom-icons" [enableOnOffLabels]="true" [checkedIcon]="checkedIcon" [uncheckedIcon]="uncheckedIcon" [checked]="true">
        Custom Icons
      </ion-toggle>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonToggle],
})
export class ToggleIconsComponent {
  checkedIcon = 'moon';
  uncheckedIcon = 'sunny';
}
