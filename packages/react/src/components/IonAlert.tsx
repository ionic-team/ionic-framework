import { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-alert.js';

import { createInlineOverlayComponent } from './createInlineOverlayComponent';

export const IonAlert = /*@__PURE__*/ createInlineOverlayComponent<JSX.IonAlert, HTMLIonAlertElement>(
  'ion-alert',
  defineCustomElement
);
