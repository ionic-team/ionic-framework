import {
  PickerButton,
  PickerColumn,
  PickerOptions,
  pickerController,
} from '@ionic/core';

import { HookOverlayOptions } from './HookOverlayOptions';
import { useController } from './useController';

/**
 * A hook for presenting/dismissing an IonPicker component
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonPicker(): UseIonPickerResult {
  const controller = useController<PickerOptions, HTMLIonPickerElement>(
    'IonPicker',
    pickerController
  );

  function present(columns: PickerColumn[], buttons?: PickerButton[]): void;
  function present(options: PickerOptions & HookOverlayOptions): void;
  function present(
    columnsOrOptions: PickerColumn[] | (PickerOptions & HookOverlayOptions),
    buttons?: PickerButton[]
  ) {
    if (Array.isArray(columnsOrOptions)) {
      controller.present({
        columns: columnsOrOptions,
        buttons: buttons ?? [{ text: 'Ok' }],
      });
    } else {
      controller.present(columnsOrOptions);
    }
  }

  return [present, controller.dismiss];
}

export type UseIonPickerResult = [
  {
    /**
     * Presents the picker
     * @param columns Array of columns to be displayed in the picker.
     * @param buttons Optional - Array of buttons to be displayed at the top of the picker.
     */
    (columns: PickerColumn[], buttons?: PickerButton[]): void;
    /**
     * Presents the picker
     * @param options The options to pass to the IonPicker
     */
    (options: PickerOptions & HookOverlayOptions): void;
  },
  /**
   * Dismisses the picker
   */
  () => void
];
