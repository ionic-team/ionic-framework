import { ActionSheetOptions } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

const IonActionSheet = createControllerComponent<ActionSheetOptions, HTMLIonActionSheetElement, HTMLIonActionSheetControllerElement>('ion-alert', 'ion-alert-controller')
export default IonActionSheet;
