import { Injectable } from '@angular/core';
import { ActionSheetController as ActionSheetControllerBase } from '@ionic/angular/common';
import { actionSheetController } from '@ionic/core/components';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetController extends ActionSheetControllerBase {
  constructor() {
    super(actionSheetController);
  }
}
