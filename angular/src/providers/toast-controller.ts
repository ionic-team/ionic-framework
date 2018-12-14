import { Injectable } from '@angular/core';
import { ToastOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable()
export class ToastController extends OverlayBaseController<ToastOptions, HTMLIonToastElement> {
  constructor() {
    super('ion-toast-controller');
  }
}
