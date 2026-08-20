import { Component, Input } from '@angular/core';
import { IonNav } from '@ionic/angular';

/**
 * Presented as a modal via `ModalController` with the nav root passed through
 * `componentProps`. Reproduces #31220, where the `[root]` binding used to land
 * after `ion-nav` had already loaded, leaving the nav empty.
 */
@Component({
  selector: 'app-nav-wrapper',
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  standalone: true,
  imports: [IonNav],
})
export class NavWrapperComponent {
  @Input() rootPage: any;
}
