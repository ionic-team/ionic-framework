import { Components } from '@ionic/core';
import { createOverlayComponent } from './createOverlayComponent';
import { Omit } from './types';

export type ActionSheetOptions = Omit<Components.IonActionSheetAttributes, 'overlayIndex'>;

const IonActionSheet = createOverlayComponent<ActionSheetOptions, HTMLIonActionSheetElement, HTMLIonActionSheetControllerElement>('ion-action-sheet', 'ion-action-sheet-controller')
export default IonActionSheet;
