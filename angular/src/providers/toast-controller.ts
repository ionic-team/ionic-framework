import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ToastOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable({
  providedIn: 'root',
})
export class ToastController extends OverlayBaseController<ToastOptions, HTMLIonToastElement> {
  constructor(@Inject(DOCUMENT) doc: any) {
    super('ion-toast-controller', doc);
  }
}
