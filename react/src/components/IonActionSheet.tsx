import { Components } from '@ionic/core';
import { createOverlayComponent } from './createOverlayComponent';

export type ActionSheetOptions = Components.IonActionSheetAttributes;

const IonActionSheet = createOverlayComponent<ActionSheetOptions, HTMLIonActionSheetElement, HTMLIonActionSheetControllerElement>('ion-action-sheet', 'ion-action-sheet-controller')
export default IonActionSheet;
