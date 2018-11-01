import { AlertOptions } from '@ionic/core';
import { OverlayBaseController } from '../util';

export const CTRL = 'ion-alert-controller';
export class AlertController extends OverlayBaseController<AlertOptions, HTMLIonAlertElement> {
  constructor() {
    super(CTRL);
  }
}
