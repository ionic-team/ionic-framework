import type { LoadingOptions} from '@ionic/core/components';
import { loadingController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-loading.js';

import { createControllerComponent } from './createControllerComponent';

export const IonLoading = /*@__PURE__*/ createControllerComponent<
  LoadingOptions,
  HTMLIonLoadingElement
>('ion-loading', loadingController, defineCustomElement);
