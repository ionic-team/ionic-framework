import { ActionSheetOptions } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

const IonActionSheet = createControllerComponent<ActionSheetOptions, HTMLIonActionSheetElement, HTMLIonActionSheetControllerElement>('ion-action-sheet', 'ion-action-sheet-controller')
export default IonActionSheet;
