import { ActionSheetButton, ActionSheetOptions, actionSheetController } from '@ionic/core';

import { HookOverlayOptions } from './HookOverlayOptions';
import { useController } from './useController';

/**
 * A hook for presenting/dismissing an IonActionSheet component
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonActionSheet(): UseIonActionSheetResult {
  const controller = useController<ActionSheetOptions, HTMLIonActionSheetElement>(
    'IonActionSheet',
    actionSheetController
  );

  function present(buttons: ActionSheetButton[], header?: string): void;
  function present(options: ActionSheetOptions & HookOverlayOptions): void;
  function present(buttonsOrOptions: ActionSheetButton[] | ActionSheetOptions & HookOverlayOptions, header?: string) {
    if (Array.isArray(buttonsOrOptions)) {
      controller.present({
        buttons: buttonsOrOptions,
        header
      });
    } else {
      controller.present(buttonsOrOptions);
    }
  }

  return [
    present,
    controller.dismiss
  ];
}

export type UseIonActionSheetResult = [
  {
    /**
     * Presents the action sheet
     * @param buttons An array of buttons for the action sheet
     * @param header Optional - Title for the action sheet
     */
    (buttons: ActionSheetButton[], header?: string | undefined): void;
    /**
     * Presents the action sheet
     * @param options The options to pass to the IonActionSheet
     */
    (options: ActionSheetOptions & HookOverlayOptions): void;
  },
  /**
   * Dismisses the action sheet
   */
  () => void
];
