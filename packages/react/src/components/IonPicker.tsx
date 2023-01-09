import { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-picker.js';

import { createInlineOverlayComponent } from './createInlineOverlayComponent';

export const IonPicker = /*@__PURE__*/ createInlineOverlayComponent<
  JSX.IonPicker,
  HTMLIonPickerElement
>('ion-picker', defineCustomElement);
