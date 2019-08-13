import { JSX, actionSheetController } from '@ionic/core';

import { createOverlayComponent } from './createOverlayComponent';

export type ActionSheetOptions = JSX.IonActionSheet;

export const IonActionSheet = /*@__PURE__*/createOverlayComponent<ActionSheetOptions, HTMLIonActionSheetElement>('IonActionSheet', actionSheetController);
