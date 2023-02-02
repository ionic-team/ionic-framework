import type { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-loading.js';

import { createInlineOverlayComponent } from './createInlineOverlayComponent';

export const IonLoading = /*@__PURE__*/ createInlineOverlayComponent<JSX.IonLoading, HTMLIonLoadingElement>(
  'ion-loading',
  defineCustomElement
);
