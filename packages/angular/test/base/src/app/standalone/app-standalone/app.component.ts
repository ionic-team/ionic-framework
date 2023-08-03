import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular/standalone';
/**
 * This temporary code initialized Ionic and ensures components are visible.
 * TODO FW-4766 Can be removed when ticket is implemented
 */
import { initialize } from '@ionic/core/components';
initialize();

document.querySelector('html')!.classList.add('ion-ce')


@Component({
  selector: 'app-root-standalone',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, IonRouterOutlet]
})
export class AppComponent {
}
