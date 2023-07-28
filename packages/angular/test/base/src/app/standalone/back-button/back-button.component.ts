import { Component } from '@angular/core';
import { IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-standalone-back-button',
  templateUrl: './back-button.component.html',
  standalone: true,
  imports: [IonBackButton]
})
export class BackButtonComponent {
}
