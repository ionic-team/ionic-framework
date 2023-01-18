import type { ToastButton as ToastButtonCore, ToastOptions as ToastOptionsCore } from '@ionic/core/components';
import { toastController as toastControllerCore } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-toast.js';

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
  'ion-toast',
  toastController,
  defineCustomElement
);
