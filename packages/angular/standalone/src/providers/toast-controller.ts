import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { ToastOptions } from '@ionic/core/components';
import { toastController } from '@ionic/core/components';

@Injectable({
  providedIn: 'root',
})
export class ToastController extends OverlayBaseController<ToastOptions, HTMLIonToastElement> {
  constructor() {
    super(toastController);
  }
}
