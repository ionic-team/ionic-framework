import { JSX } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { ReactProps } from './ReactProps';

export type ToastOptions = JSX.IonToast;

export const IonToast = /*@__PURE__*/createControllerComponent<ToastOptions & ReactProps, HTMLIonToastElement, HTMLIonToastControllerElement>('ion-toast', 'ion-toast-controller')
