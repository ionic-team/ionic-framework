import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { PickerOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable({
  providedIn: 'root',
})
export class PickerController extends OverlayBaseController<PickerOptions, HTMLIonPickerElement> {
  constructor(@Inject(DOCUMENT) doc: any) {
    super('ion-picker-controller', doc);
  }
}
