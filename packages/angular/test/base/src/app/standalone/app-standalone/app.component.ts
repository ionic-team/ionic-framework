import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root-standalone',
  // Angular 22 defaults to OnPush, and a tick stops at a clean OnPush view.
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './app.component.html',
  standalone: true,
  imports: [IonRouterOutlet, IonApp],
})
export class AppComponent {
}
