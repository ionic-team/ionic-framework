import { JSX } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { ReactProps } from './ReactProps';

export type LoadingOptions = JSX.IonLoading;

const IonLoading = createControllerComponent<LoadingOptions & ReactProps, HTMLIonLoadingElement, HTMLIonLoadingControllerElement>('ion-loading', 'ion-loading-controller')
export default IonLoading;
