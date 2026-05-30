import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { AlertOptions } from '@ionic/core/components';
import { alertController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-alert.js';

@Injectable({
  providedIn: 'root',
})
export class AlertController extends OverlayBaseController<AlertOptions, HTMLIonAlertElement> {
  constructor() {
    super(alertController);
    defineCustomElement();
  }
}
