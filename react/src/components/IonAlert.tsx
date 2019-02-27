import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

export type AlertOptions = Components.IonAlertAttributes;

const IonAlert = createControllerComponent<AlertOptions, HTMLIonAlertElement, HTMLIonAlertControllerElement>('ion-alert', 'ion-alert-controller')
export default IonAlert;
