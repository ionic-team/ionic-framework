import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { ReactProps } from './ReactProps';

export type ToastOptions = Components.IonToastAttributes;

const IonToast = createControllerComponent<ToastOptions & ReactProps, HTMLIonToastElement, HTMLIonToastControllerElement>('ion-toast', 'ion-toast-controller')
export default IonToast;
