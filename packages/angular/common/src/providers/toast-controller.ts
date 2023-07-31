import { Injectable } from '@angular/core';
import type { ToastOptions } from '@ionic/core/components';
import { toastController } from '@ionic/core/components';

import { OverlayBaseController } from '../utils/overlay';

@Injectable({
  providedIn: 'root',
})
export class ToastController extends OverlayBaseController<ToastOptions, HTMLIonToastElement> {
  constructor() {
    super(toastController);
  }
}
