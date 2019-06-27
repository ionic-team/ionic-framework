import { JSX, toastController } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

export type ToastOptions = JSX.IonToast;

export const IonToast = /*@__PURE__*/createControllerComponent<ToastOptions, HTMLIonToastElement>('IonToast', toastController);
