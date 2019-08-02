import { ToastOptions, toastController } from '@ionic/core';

import { createControllerComponent } from './createControllerComponent';

export const IonToast = /*@__PURE__*/createControllerComponent<ToastOptions, HTMLIonToastElement>('IonToast', toastController);
