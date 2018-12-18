import { LoadingOptions } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

const IonActionSheet = createControllerComponent<LoadingOptions, HTMLIonLoadingElement, HTMLIonLoadingControllerElement>('ion-loading', 'ion-loading-controller')
export default IonActionSheet;
