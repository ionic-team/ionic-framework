import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { PickerOptions } from '@ionic/core';
import { pickerController } from '@ionic/core';

/**
 * @deprecated Use the inline ion-picker component instead.
 */
@Injectable({
  providedIn: 'root',
})
export class PickerController extends OverlayBaseController<PickerOptions, HTMLIonPickerLegacyElement> {
  constructor() {
    super(pickerController);
  }
}
