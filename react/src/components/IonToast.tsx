import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

export type ToastOptions = Components.IonToastAttributes;

const IonToast = createControllerComponent<ToastOptions, HTMLIonToastElement, HTMLIonToastControllerElement>('ion-toast', 'ion-toast-controller')
export default IonToast;
