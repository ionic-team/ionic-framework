import { JSX, actionSheetController } from '@ionic/core';
import { createOverlayComponent } from './createOverlayComponent';
import { ReactProps } from './ReactProps';

export type ActionSheetOptions = JSX.IonActionSheet;

export const IonActionSheet = /*@__PURE__*/createOverlayComponent<ActionSheetOptions & ReactProps, HTMLIonActionSheetElement>('IonActionSheet', actionSheetController)
