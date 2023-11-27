import type { PickerButton, PickerColumn, PickerOptions } from '@ionic/core/components';
import { pickerController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-picker-legacy.js';
import { useCallback } from 'react';

import type { HookOverlayOptions } from './HookOverlayOptions';
import { useController } from './useController';

/**
 * A hook for presenting/dismissing an IonPicker component
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonPicker(): UseIonPickerResult {
  const controller = useController<PickerOptions, HTMLIonPickerElement>(
    'IonPicker',
    pickerController,
    defineCustomElement
  );

  const present = useCallback(
    (columnsOrOptions: PickerColumn[] | (PickerOptions & HookOverlayOptions), buttons?: PickerButton[]) => {
      if (Array.isArray(columnsOrOptions)) {
        return controller.present({
          columns: columnsOrOptions,
          buttons: buttons ?? [{ text: 'Ok' }],
        });
      } else {
        return controller.present(columnsOrOptions);
      }
    },
    [controller.present]
  );

  return [present, controller.dismiss];
}

export type UseIonPickerResult = [
  {
    /**
     * Presents the picker
     * @param columns Array of columns to be displayed in the picker.
     * @param buttons Optional - Array of buttons to be displayed at the top of the picker.
     */
    (columns: PickerColumn[], buttons?: PickerButton[]): Promise<void>;
    /**
     * Presents the picker
     * @param options The options to pass to the IonPicker
     */
    (options: PickerOptions & HookOverlayOptions): Promise<void>;
  },
  /**
   * Dismisses the picker
   */
  () => Promise<void>
];
