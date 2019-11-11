import { Injectable } from '@angular/core';
import { ToastOptions, toastController } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable({
  providedIn: 'root',
})
export class ToastController extends OverlayBaseController<ToastOptions, HTMLIonToastElement> {
  constructor() {
    super(toastController);
  }
}
