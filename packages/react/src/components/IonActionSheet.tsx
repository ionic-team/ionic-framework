import { ActionSheetOptions, actionSheetController } from '@ionic/core';

import { createOverlayComponent } from './createOverlayComponent';

export const IonActionSheet = /*@__PURE__*/createOverlayComponent<ActionSheetOptions, HTMLIonActionSheetElement>('IonActionSheet', actionSheetController);
