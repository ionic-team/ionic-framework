import type {
  ActionSheetButton as ActionSheetButtonCore,
  ActionSheetOptions as ActionSheetOptionsCore} from '@ionic/core/components';
import {
  actionSheetController as actionSheetControllerCore,
} from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-action-sheet.js';

import { createOverlayComponent } from './createOverlayComponent';

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

const actionSheetController = {
  // TODO(FW-2959): type
  create: (options: ActionSheetOptions) => actionSheetControllerCore.create(options as any),
  dismiss: (data?: any, role?: string | undefined, id?: string | undefined) =>
    actionSheetControllerCore.dismiss(data, role, id),
  getTop: () => actionSheetControllerCore.getTop(),
};

export const IonActionSheet = /*@__PURE__*/ createOverlayComponent<
  ActionSheetOptions,
  HTMLIonActionSheetElement
>('ion-action-sheet', actionSheetController, defineCustomElement);
