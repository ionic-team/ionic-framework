import { AlertOptions, alertController } from '@ionic/core';

import { createControllerComponent } from './createControllerComponent';

export const IonAlert = /*@__PURE__*/ createControllerComponent<AlertOptions, HTMLIonAlertElement>(
  'IonAlert',
  alertController
);
