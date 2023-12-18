import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { AlertOptions } from '@ionic/core';
import { alertController } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class AlertController extends OverlayBaseController<AlertOptions, HTMLIonAlertElement> {
  constructor() {
    super(alertController);
  }
}
