import type { LoadingOptions, SpinnerTypes } from '@ionic/core/components';
import { loadingController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-loading.js';
import { useCallback } from 'react';

import type { HookOverlayOptions } from './HookOverlayOptions';
import { useController } from './useController';

/**
 * A hook for presenting/dismissing an IonLoading component
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonLoading(): UseIonLoadingResult {
  const controller = useController<LoadingOptions, HTMLIonLoadingElement>(
    'IonLoading',
    loadingController,
    defineCustomElement
  );

  const present = useCallback(
    (
      messageOrOptions: string | (LoadingOptions & HookOverlayOptions) = {},
      duration?: number,
      spinner?: SpinnerTypes
    ) => {
      if (typeof messageOrOptions === 'string') {
        return controller.present({
          message: messageOrOptions,
          duration,
          spinner,
        });
      } else {
        return controller.present(messageOrOptions);
      }
    },
    [controller.present]
  );

  return [present, controller.dismiss];
}

export type UseIonLoadingResult = [
  {
    /**
     * Presents the loading indicator
     * @param message Optional - Text content to display in the loading indicator, defaults to blank string
     * @param duration Optional - Number of milliseconds to wait before dismissing the loading indicator
     * @param spinner Optional - The name of the spinner to display, defaults to "lines"
     */
    (message?: string, duration?: number, spinner?: SpinnerTypes): Promise<void>;
    /**
     * Presents the loading indicator
     * @param options The options to pass to the IonLoading
     */
    (options: LoadingOptions & HookOverlayOptions): Promise<void>;
  },
  /**
   * Dismisses the loading indicator
   */
  () => Promise<void>
];
