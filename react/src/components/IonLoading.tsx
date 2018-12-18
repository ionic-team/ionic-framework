import { LoadingOptions } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

const IonActionSheet = createControllerComponent<LoadingOptions, HTMLIonLoadingElement, HTMLIonLoadingControllerElement>('ion-alert', 'ion-alert-controller')
export default IonActionSheet;
