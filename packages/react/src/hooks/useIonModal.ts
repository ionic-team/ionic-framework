import { ModalOptions, modalController } from '@ionic/core';

import { HookOverlayOptions } from './HookOverlayOptions';
import { ReactComponentOrElement, useOverlay } from './useOverlay';

/**
 * A hook for presenting/dismissing an IonModal component
 * @param component The component that the modal will show. Can be a React Component, a functional component, or a JSX Element
 * @param componentProps The props that will be passed to the component, if required
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonModal(component: ReactComponentOrElement, componentProps?: any): UseIonModalResult {
  const controller = useOverlay<ModalOptions, HTMLIonModalElement>(
    'IonModal',
    modalController,
    component,
    componentProps
  );

  function present(options: Omit<ModalOptions, 'component' | 'componentProps'> & HookOverlayOptions = {}) {
    controller.present(options as any);
  };

  return [
    present,
    controller.dismiss
  ];
}

export type UseIonModalResult = [
  (options?: Omit<ModalOptions, 'component' | 'componentProps'> & HookOverlayOptions) => void,
  /**
   * Dismisses the modal
   */
  () => void
];
