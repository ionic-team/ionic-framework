import type { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-picker-legacy.js';

import { createInlineOverlayComponent } from './createInlineOverlayComponent';

export const IonPickerLegacy = /*@__PURE__*/ createInlineOverlayComponent<
  JSX.IonPickerLegacy,
  HTMLIonPickerLegacyElement
>('ion-picker-legacy', defineCustomElement);
