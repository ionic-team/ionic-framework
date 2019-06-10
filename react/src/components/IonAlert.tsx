import { JSX } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { ReactProps } from './ReactProps';

export type AlertOptions = JSX.IonAlert;

export const IonAlert = /*@__PURE__*/createControllerComponent<AlertOptions & ReactProps, HTMLIonAlertElement, HTMLIonAlertControllerElement>('ion-alert', 'ion-alert-controller')
