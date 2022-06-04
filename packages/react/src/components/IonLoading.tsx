import { LoadingOptions, loadingController } from '@ionic/core/components';
import { IonLoading as IonLoadingCmp } from '@ionic/core/components/ion-loading.js';

import { createControllerComponent } from './createControllerComponent';

export const IonLoading = /*@__PURE__*/ createControllerComponent<
  LoadingOptions,
  HTMLIonLoadingElement
>('ion-loading', loadingController, IonLoadingCmp);
