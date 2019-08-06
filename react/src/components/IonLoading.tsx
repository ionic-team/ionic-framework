import { JSX, loadingController } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

export type LoadingOptions = JSX.IonLoading;

export const IonLoading = /*@__PURE__*/createControllerComponent<LoadingOptions, HTMLIonLoadingElement>('IonLoading', loadingController)
