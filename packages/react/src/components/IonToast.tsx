import {
  JSX,
  ToastButton as ToastButtonCore,
  ToastOptions as ToastOptionsCore
} from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-toast.js';

import { createInlineOverlayComponent } from './createInlineOverlayComponent';

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

export const IonToast = /*@__PURE__*/ createInlineOverlayComponent<JSX.IonToast, HTMLIonToastElement>(
  'ion-toast',
  defineCustomElement
);
