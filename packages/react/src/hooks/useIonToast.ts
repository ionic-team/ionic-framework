import type { ToastOptions} from '@ionic/core/components';
import { toastController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-toast.js';
import { useCallback } from 'react';

import type { HookOverlayOptions } from './HookOverlayOptions';
import { useController } from './useController';

/**
 * A hook for presenting/dismissing an IonToast component
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonToast(): UseIonToastResult {
  const controller = useController<ToastOptions, HTMLIonToastElement>(
    'IonToast',
    toastController,
    defineCustomElement
  );

  const present = useCallback((messageOrOptions: string | ToastOptions & HookOverlayOptions, duration?: number) => {
    if (typeof messageOrOptions === 'string') {
      return controller.present({
        message: messageOrOptions,
        duration
      });
    } else {
      return controller.present(messageOrOptions);
    }
  }, [controller.present]);

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
    (message: string, duration?: number): Promise<void>;
    /**
     * Presents the Toast
     * @param options The options to pass to the IonToast.
     */
    (options: ToastOptions & HookOverlayOptions): Promise<void>;
  },
  /**
   * Dismisses the toast
   */
  () => Promise<void>
];
