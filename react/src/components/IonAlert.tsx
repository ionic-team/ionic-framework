import { JSX, alertController } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

export type AlertOptions = JSX.IonAlert;

export const IonAlert = /*@__PURE__*/createControllerComponent<AlertOptions, HTMLIonAlertElement>('IonAlert', alertController)
