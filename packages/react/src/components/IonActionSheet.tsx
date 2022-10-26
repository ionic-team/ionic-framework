import {
  ActionSheetButton as ActionSheetButtonCore,
  ActionSheetOptions as ActionSheetOptionsCore,
} from '@ionic/core/components';
import { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-action-sheet.js';

import { createInlineOverlayComponent } from './createInlineOverlayComponent';

export interface ActionSheetButton extends Omit<ActionSheetButtonCore, 'icon'> {
  icon?:
  | {
    ios: string;
    md: string;
  }
  | string;
}

export interface ActionSheetOptions extends Omit<ActionSheetOptionsCore, 'buttons'> {
  buttons?: (ActionSheetButton | string)[];
}

export const IonActionSheet = /*@__PURE__*/ createInlineOverlayComponent<
  JSX.IonActionSheet,
  HTMLIonActionSheetElement
>('ion-action-sheet', defineCustomElement);
