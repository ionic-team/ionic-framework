import { LoadingOptions, loadingController } from '@ionic/core';

import { createControllerComponent } from './createControllerComponent';

export const IonLoading = /*@__PURE__*/ createControllerComponent<
  LoadingOptions,
  HTMLIonLoadingElement
>('IonLoading', loadingController);
