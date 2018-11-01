import { ToastOptions } from '@ionic/core';
import { OverlayBaseController } from '../util';

export class ToastController extends OverlayBaseController<ToastOptions, HTMLIonToastElement> {
  constructor() {
    super('ion-toast-controller');
  }
}
