import { AlertOptions } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

const IonAlert = createControllerComponent<AlertOptions, HTMLIonAlertElement, HTMLIonAlertControllerElement>('ion-alert', 'ion-alert-controller')
export default IonAlert;
