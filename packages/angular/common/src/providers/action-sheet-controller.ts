import { Injectable } from '@angular/core';
import type { ActionSheetOptions } from '@ionic/core/components';
import { actionSheetController } from '@ionic/core/components';

import { OverlayBaseController } from '../utils/overlay';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetController extends OverlayBaseController<ActionSheetOptions, HTMLIonActionSheetElement> {
  constructor() {
    super(actionSheetController);
  }
}
