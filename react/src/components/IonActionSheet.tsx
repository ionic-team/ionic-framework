import { Components } from '@ionic/core';
import { createOverlayComponent } from './createOverlayComponent';
import { ReactProps } from './ReactProps';

export type ActionSheetOptions = Components.IonActionSheetAttributes;

const IonActionSheet = createOverlayComponent<ActionSheetOptions & ReactProps, HTMLIonActionSheetElement, HTMLIonActionSheetControllerElement>('ion-action-sheet', 'ion-action-sheet-controller')
export default IonActionSheet;
