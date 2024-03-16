import { Component } from '@angular/core';
import { MenuController, IonMenu } from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu-controller',
  templateUrl: './menu-controller.component.html',
  standalone: true,
  imports: [IonMenu]
})
export class MenuControllerComponent {
  registeredMenuCount = 0;

  constructor(private menuCtrl: MenuController) {}

  async setMenuCount() {
    const menus = await this.menuCtrl.getMenus();
    this.registeredMenuCount = menus.length;
  }
}
