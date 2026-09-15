import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { ToastOptions } from '@ionic/core';
import { toastController } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class ToastController extends OverlayBaseController<ToastOptions, HTMLIonToastElement> {
  constructor() {
    super(toastController);
  }
}
