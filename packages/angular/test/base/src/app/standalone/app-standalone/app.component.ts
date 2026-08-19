import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root-standalone',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [IonRouterOutlet, IonApp]
})
export class AppComponent {
}
