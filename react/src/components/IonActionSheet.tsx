import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { Omit } from './types';

export type ActionSheetOptions = Omit<Components.IonActionSheetAttributes, 'overlayIndex'>;

const IonActionSheet = createControllerComponent<ActionSheetOptions, HTMLIonActionSheetElement, HTMLIonActionSheetControllerElement>('ion-action-sheet', 'ion-action-sheet-controller')
export default IonActionSheet;
