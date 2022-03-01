import { createValueTrackedComponent } from './createValueTrackedComponent';

import type { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-textarea.js';

export const IonTextarea = /*@__PURE__*/createValueTrackedComponent<JSX.IonTextarea, HTMLIonTextareaElement>('ion-textarea', undefined, undefined, defineCustomElement);
