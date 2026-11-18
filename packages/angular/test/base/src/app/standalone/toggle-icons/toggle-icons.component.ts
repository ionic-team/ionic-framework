import { Component } from '@angular/core';
import { IonContent, IonToggle } from '@ionic/angular';

/**
 * The property bindings fail the template compile if the standalone
 * `IonToggle` is missing either input.
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
