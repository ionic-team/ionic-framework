import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { Omit } from './types';

export type LoadingOptions = Omit<Components.IonLoadingAttributes, 'overlayIndex'>;

const IonActionSheet = createControllerComponent<LoadingOptions, HTMLIonLoadingElement, HTMLIonLoadingControllerElement>('ion-loading', 'ion-loading-controller')
export default IonActionSheet;
