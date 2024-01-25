import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { PickerOptions } from '@ionic/core/components';
import { pickerController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-picker.js';

@Injectable({
  providedIn: 'root',
})
export class PickerController extends OverlayBaseController<PickerOptions, HTMLIonPickerElement> {
  constructor() {
    super(pickerController);
    defineCustomElement();
  }
}
