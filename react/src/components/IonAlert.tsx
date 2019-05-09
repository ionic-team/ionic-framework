import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { ReactProps } from './ReactProps';

export type AlertOptions = Components.IonAlertAttributes;

const IonAlert = createControllerComponent<AlertOptions & ReactProps, HTMLIonAlertElement, HTMLIonAlertControllerElement>('ion-alert', 'ion-alert-controller')
export default IonAlert;
