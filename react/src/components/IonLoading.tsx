import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

export type LoadingOptions = Components.IonLoadingAttributes;

const IonActionSheet = createControllerComponent<LoadingOptions, HTMLIonLoadingElement, HTMLIonLoadingControllerElement>('ion-loading', 'ion-loading-controller')
export default IonActionSheet;
