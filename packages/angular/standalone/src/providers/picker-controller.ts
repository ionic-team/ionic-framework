import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { PickerOptions } from '@ionic/core/components';
import { pickerController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-picker-legacy.js';

/**
 * @deprecated Use the inline ion-picker component instead.
 */
@Injectable({
  providedIn: 'root',
})
export class PickerController extends OverlayBaseController<PickerOptions, HTMLIonPickerLegacyElement> {
  constructor() {
    super(pickerController);
    defineCustomElement();
  }
}
