import type { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-textarea.js';

import { createValueTrackedComponent } from './createValueTrackedComponent';

export const IonTextarea = /*@__PURE__*/createValueTrackedComponent<JSX.IonTextarea, HTMLIonTextareaElement>('ion-textarea', undefined, undefined, defineCustomElement);
