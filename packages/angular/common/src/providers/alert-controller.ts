import { Injectable } from '@angular/core';
import type { AlertOptions } from '@ionic/core/components';
import { alertController } from '@ionic/core/components';

import { OverlayBaseController } from '../utils/overlay';

@Injectable({
  providedIn: 'root',
})
export class AlertController extends OverlayBaseController<AlertOptions, HTMLIonAlertElement> {
  constructor() {
    super(alertController);
  }
}
