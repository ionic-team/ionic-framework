import { ActionSheetOptions } from '@ionic/core';
import { OverlayBaseController } from '../util';

export const CTRL = 'ion-action-sheet-controller';
export class ActionSheetController extends OverlayBaseController<ActionSheetOptions, HTMLIonActionSheetElement> {
  constructor() {
    super(CTRL);
  }
}
