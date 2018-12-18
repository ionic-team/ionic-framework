import { ToastOptions } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

const IonToast = createControllerComponent<ToastOptions, HTMLIonToastElement, HTMLIonToastControllerElement>('ion-alert', 'ion-alert-controller')
export default IonToast;
