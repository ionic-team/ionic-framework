import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab-one',
  template: `
    Tab 1

    <p id="parent-outlet">
      Has Parent Outlet: <span>{{ hasParentOutlet }}</span>
    </p>
  `,
  standalone: true,
})
export class TabOneComponent {
  hasParentOutlet = false;

  constructor(private routerOutlet: IonRouterOutlet) {
    this.hasParentOutlet = routerOutlet.parentOutlet != null;
  }
}
