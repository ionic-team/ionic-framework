import { Injectable } from '@angular/core';
import { ActionSheetOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable()
export class ActionSheetController extends OverlayBaseController<ActionSheetOptions, HTMLIonActionSheetElement> {
  constructor() {
    super('ion-action-sheet-controller');
  }
}
