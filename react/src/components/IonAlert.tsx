import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { Omit } from './types';

export type AlertOptions = Omit<Components.IonAlertAttributes, 'overlayIndex'>;

const IonAlert = createControllerComponent<AlertOptions, HTMLIonAlertElement, HTMLIonAlertControllerElement>('ion-alert', 'ion-alert-controller')
export default IonAlert;
