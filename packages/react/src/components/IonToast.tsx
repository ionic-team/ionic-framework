import type { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-toast.js';

import { createInlineOverlayComponent } from './createInlineOverlayComponent';

export const IonToast = /*@__PURE__*/ createInlineOverlayComponent<JSX.IonToast, HTMLIonToastElement>(
  'ion-toast',
  defineCustomElement
);
