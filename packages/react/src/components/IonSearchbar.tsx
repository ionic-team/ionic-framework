import type { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-searchbar.js';

import { createValueTrackedComponent } from './createValueTrackedComponent';

export const IonSearchbar = /*@__PURE__*/createValueTrackedComponent<JSX.IonSearchbar, HTMLIonSearchbarElement>('ion-searchbar', undefined, undefined, defineCustomElement);
