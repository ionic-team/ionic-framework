import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AlertOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable({
  providedIn: 'root',
})
export class AlertController extends OverlayBaseController<AlertOptions, HTMLIonAlertElement> {
  constructor(@Inject(DOCUMENT) doc: any) {
    super('ion-alert-controller', doc);
  }
}
