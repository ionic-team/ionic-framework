import { LoadingOptions, SpinnerTypes, loadingController } from '@ionic/core';

import { HookOverlayOptions } from './HookOverlayOptions';
import { useController } from './useController';

/**
 * A hook for presenting/dismissing an IonLoading component
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonLoading(): UseIonLoadingResult {
  const controller = useController<LoadingOptions, HTMLIonLoadingElement>(
    'IonLoading',
    loadingController
  );

  function present(
    message?: string,
    duration?: number,
    spinner?: SpinnerTypes
  ): void;
  function present(options: LoadingOptions & HookOverlayOptions): void;
  function present(
    messageOrOptions: string | (LoadingOptions & HookOverlayOptions) = '',
    duration?: number,
    spinner?: SpinnerTypes
  ) {
    if (typeof messageOrOptions === 'string') {
      controller.present({
        message: messageOrOptions,
        duration,
        spinner: spinner ?? 'lines',
      });
    } else {
      controller.present(messageOrOptions);
    }
  }

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
    (message?: string, duration?: number, spinner?: SpinnerTypes): void;
    /**
     * Presents the loading indicator
     * @param options The options to pass to the IonLoading
     */
    (options: LoadingOptions & HookOverlayOptions): void;
  },
  /**
   * Dismisses the loading indicator
   */
  () => void
];
