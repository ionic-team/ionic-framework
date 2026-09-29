import { ChangeDetectorRef, Component } from '@angular/core';
import { MenuController, IonMenu } from '@ionic/angular';

@Component({
  selector: 'app-menu-controller',
  templateUrl: './menu-controller.component.html',
  standalone: true,
  imports: [IonMenu]
})
export class MenuControllerComponent {
  registeredMenuCount = 0;

  constructor(private menuCtrl: MenuController, private cdr: ChangeDetectorRef) {}

  async setMenuCount() {
    const menus = await this.menuCtrl.getMenus();
    this.registeredMenuCount = menus.length;
    // Zoneless: state set in an async callback Angular does not wrap won't re-render on its own; mark the view dirty.
    this.cdr.markForCheck();
  }
}
