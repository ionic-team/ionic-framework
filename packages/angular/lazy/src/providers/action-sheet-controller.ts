import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { ActionSheetOptions } from '@ionic/core';
import { actionSheetController } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetController extends OverlayBaseController<ActionSheetOptions, HTMLIonActionSheetElement> {
  constructor() {
    super(actionSheetController);
  }
}
