import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { ReactProps } from './ReactProps';

export type LoadingOptions = Components.IonLoadingAttributes;

const IonLoading = createControllerComponent<LoadingOptions & ReactProps, HTMLIonLoadingElement, HTMLIonLoadingControllerElement>('ion-loading', 'ion-loading-controller')
export default IonLoading;
