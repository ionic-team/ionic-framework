import { Injectable } from '@angular/core';
import type { PickerOptions } from '@ionic/core/components';
import { pickerController } from '@ionic/core/components';

import { OverlayBaseController } from '../utils/overlay';

@Injectable({
  providedIn: 'root',
})
export class PickerController extends OverlayBaseController<PickerOptions, HTMLIonPickerElement> {
  constructor() {
    super(pickerController);
  }
}
