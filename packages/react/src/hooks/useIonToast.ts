import { ToastOptions, toastController } from '@ionic/core';

import { HookOverlayOptions } from './HookOverlayOptions';
import { useController } from './useController';

/**
 * A hook for presenting/dismissing an IonToast component
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonToast(): UseIonToastResult {
  const controller = useController<ToastOptions, HTMLIonToastElement>(
    'IonToast',
    toastController
  );

  function present(message: string, duration?: number): void;
  function present(options: ToastOptions & HookOverlayOptions): void;
  function present(messageOrOptions: string | ToastOptions & HookOverlayOptions, duration?: number) {
    if (typeof messageOrOptions === 'string') {
      controller.present({
        message: messageOrOptions,
        duration
      });
    } else {
      controller.present(messageOrOptions);
    }
  };

  return [
    present,
    controller.dismiss
  ];
}

export type UseIonToastResult = [
  {
    /**
     * Presents the toast
     * @param message Message to be shown in the toast.
     * @param duration Optional - How many milliseconds to wait before hiding the toast. By default, it will show until dismissToast() is called.
     */
    (message: string, duration?: number): void;
    /**
     * Presents the Toast
     * @param options The options to pass to the IonToast.
     */
    (options: ToastOptions & HookOverlayOptions): void;
  },
  /**
   * Dismisses the toast
   */
  () => void
];
