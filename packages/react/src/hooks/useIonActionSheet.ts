import type { ActionSheetButton, ActionSheetOptions} from '@ionic/core/components';
import { actionSheetController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-action-sheet.js';
import { useCallback } from 'react';

import type { HookOverlayOptions } from './HookOverlayOptions';
import { useController } from './useController';

/**
 * A hook for presenting/dismissing an IonActionSheet component
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonActionSheet(): UseIonActionSheetResult {
  const controller = useController<ActionSheetOptions, HTMLIonActionSheetElement>(
    'IonActionSheet',
    actionSheetController,
    defineCustomElement
  );

  const present = useCallback(
    (
      buttonsOrOptions: ActionSheetButton[] | (ActionSheetOptions & HookOverlayOptions),
      header?: string
    ) => {
      if (Array.isArray(buttonsOrOptions)) {
        return controller.present({
          buttons: buttonsOrOptions,
          header,
        });
      } else {
        return controller.present(buttonsOrOptions);
      }
    },
    [controller.present]
  );

  return [present, controller.dismiss];
}

export type UseIonActionSheetResult = [
  {
    /**
     * Presents the action sheet
     * @param buttons An array of buttons for the action sheet
     * @param header Optional - Title for the action sheet
     */
    (buttons: ActionSheetButton[], header?: string | undefined): Promise<void>;
    /**
     * Presents the action sheet
     * @param options The options to pass to the IonActionSheet
     */
    (options: ActionSheetOptions & HookOverlayOptions): Promise<void>;
  },
  /**
   * Dismisses the action sheet
   */
  () => Promise<void>
];
