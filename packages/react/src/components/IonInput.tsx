import { createValueTrackedComponent } from './createValueTrackedComponent';

import type { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-input.js';

export const IonInput = /*@__PURE__*/createValueTrackedComponent<JSX.IonInput, HTMLIonInputElement>('ion-input', undefined, undefined, defineCustomElement);
