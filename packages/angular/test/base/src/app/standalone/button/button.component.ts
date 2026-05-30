import { Component } from "@angular/core";
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-button',
  template: `<ion-button>Test</ion-button>`,
  standalone: true,
  imports: [IonButton]
})
export class ButtonComponent {

}
