import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { PickerOptions } from '@ionic/core';
import { pickerController } from '@ionic/core';


@Injectable({
  providedIn: 'root',
})
export class PickerController extends OverlayBaseController<PickerOptions, HTMLIonPickerElement> {
  constructor() {
    super(pickerController);
  }
}
