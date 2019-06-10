import { JSX } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { ReactProps } from './ReactProps';

export type LoadingOptions = JSX.IonLoading;

export const IonLoading = /*@__PURE__*/createControllerComponent<LoadingOptions & ReactProps, HTMLIonLoadingElement, HTMLIonLoadingControllerElement>('ion-loading', 'ion-loading-controller')
