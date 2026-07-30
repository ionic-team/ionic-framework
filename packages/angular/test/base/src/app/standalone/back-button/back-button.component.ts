import { Component } from '@angular/core';
import { IonBackButton } from '@ionic/angular';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  standalone: true,
  imports: [IonBackButton]
})
export class BackButtonComponent {}
