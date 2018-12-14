import { Injectable } from '@angular/core';
import { PickerOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable()
export class PickerController extends OverlayBaseController<PickerOptions, HTMLIonPickerElement> {
  constructor() {
    super('ion-picker-controller');
  }
}
