import { Injectable } from '@angular/core';
import { MenuController as MenuControllerBase } from '@ionic/angular/common';
import { menuController } from '@ionic/core/components';

@Injectable({
  providedIn: 'root',
})
export class MenuController extends MenuControllerBase {
  constructor() {
    super(menuController);
  }
}
