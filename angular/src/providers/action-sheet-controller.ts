import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActionSheetOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetController extends OverlayBaseController<ActionSheetOptions, HTMLIonActionSheetElement> {
  constructor(@Inject(DOCUMENT) doc: any) {
    super('ion-action-sheet-controller', doc);
  }
}
