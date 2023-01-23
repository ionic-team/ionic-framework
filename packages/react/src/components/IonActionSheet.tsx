import type { JSX } from '@ionic/core/components';
import { actionSheetController as actionSheetControllerCore } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-action-sheet.js';

import { createInlineOverlayComponent } from './createInlineOverlayComponent';

export const IonActionSheet = /*@__PURE__*/ createInlineOverlayComponent<JSX.IonActionSheet, HTMLIonActionSheetElement>(
  'ion-action-sheet',
  defineCustomElement
);
