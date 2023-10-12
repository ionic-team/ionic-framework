import { MenuController as MenuControllerBase } from '@ionic/angular/common';
import { menuController } from '@ionic/core';

export class MenuController extends MenuControllerBase {
  constructor() {
    super(menuController);
  }
}
