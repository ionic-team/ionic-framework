import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { ToastOptions } from '@ionic/core/components';
import { toastController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-toast.js';

@Injectable({
  providedIn: 'root',
})
export class ToastController extends OverlayBaseController<ToastOptions, HTMLIonToastElement> {
  constructor() {
    super(toastController);
    defineCustomElement();
  }
}
