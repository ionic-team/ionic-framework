import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root-standalone',
  // A tick won't descend past a clean OnPush view, which is Angular 22's default (#31406).
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './app.component.html',
  standalone: true,
  imports: [IonRouterOutlet, IonApp],
})
export class AppComponent {
}
