import { MenuController as MenuControllerBase } from '@ionic/angular/common';
import { menuController } from '@ionic/core/components';

export class MenuController extends MenuControllerBase {
  constructor() {
    super(menuController);
  }
}
