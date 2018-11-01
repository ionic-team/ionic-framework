import { PickerOptions } from '@ionic/core';
import { OverlayBaseController } from '../util';

export const CTRL = 'ion-picker-controller';
export class PickerController extends OverlayBaseController<PickerOptions, HTMLIonPickerElement> {
  constructor() {
    super(CTRL);
  }
}
