import { JSX } from '@ionic/core';
import { createOverlayComponent } from './createOverlayComponent';
import { ReactProps } from './ReactProps';

export type ActionSheetOptions = JSX.IonActionSheet;

export const IonActionSheet = /*@__PURE__*/createOverlayComponent<ActionSheetOptions & ReactProps, HTMLIonActionSheetElement, HTMLIonActionSheetControllerElement>('ion-action-sheet', 'ion-action-sheet-controller')
