import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { ActionSheetOptions } from '@ionic/core/components';
import { actionSheetController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-action-sheet.js';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetController extends OverlayBaseController<ActionSheetOptions, HTMLIonActionSheetElement> {
  constructor() {
    super(actionSheetController);
    defineCustomElement();
  }
}
