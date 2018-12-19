import { Injectable } from '@angular/core';
import { AlertOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable()
export class AlertController extends OverlayBaseController<AlertOptions, HTMLIonAlertElement> {
  constructor() {
    super('ion-alert-controller');
  }
}
