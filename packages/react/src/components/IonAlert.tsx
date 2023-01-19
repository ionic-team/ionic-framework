import type { AlertOptions } from '@ionic/core/components';
import { alertController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-alert.js';

import { createControllerComponent } from './createControllerComponent';

export const IonAlert = /*@__PURE__*/ createControllerComponent<AlertOptions, HTMLIonAlertElement>(
  'ion-alert',
  alertController,
  defineCustomElement
);
