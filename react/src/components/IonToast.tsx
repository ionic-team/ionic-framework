import { ToastOptions } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

const IonToast = createControllerComponent<ToastOptions, HTMLIonToastElement, HTMLIonToastControllerElement>('ion-toast', 'ion-toast-controller')
export default IonToast;
