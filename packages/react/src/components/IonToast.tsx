import {
  ToastButton as ToastButtonCore,
  ToastOptions as ToastOptionsCore,
  toastController as toastControllerCore,
} from '@ionic/core';

import { createControllerComponent } from './createControllerComponent';

export interface ToastButton extends Omit<ToastButtonCore, 'icon'> {
  icon?:
    | {
        ios: string;
        md: string;
      }
    | string;
}

export interface ToastOptions extends Omit<ToastOptionsCore, 'buttons'> {
  buttons?: (ToastButton | string)[];
}

const toastController = {
  create: (options: ToastOptions) => toastControllerCore.create(options as any),
  dismiss: (data?: any, role?: string | undefined, id?: string | undefined) =>
    toastControllerCore.dismiss(data, role, id),
  getTop: () => toastControllerCore.getTop(),
};

export const IonToast = /*@__PURE__*/ createControllerComponent<ToastOptions, HTMLIonToastElement>(
  'IonToast',
  toastController
);
