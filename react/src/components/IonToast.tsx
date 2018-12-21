import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { Omit } from './types';

export type ToastOptions = Omit<Components.IonToastAttributes, 'overlayIndex'>;

const IonToast = createControllerComponent<ToastOptions, HTMLIonToastElement, HTMLIonToastControllerElement>('ion-toast', 'ion-toast-controller')
export default IonToast;
