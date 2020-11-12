import { ModalOptions, modalController } from "@ionic/core";
import { useOverlay, ReactComponentOrElement } from "./useOverlay";
import { HookOverlayOptions } from './HookOverlayOptions';

/**
 * A hook for presenting/dismissing an IonModal component
 * @param component - The component that the modal will show. Can be a React Component, a functional component, or a JSX Element
 * @param componentProps - The props that will be passed to the component, if required
 * @returns - Returns the present and dismiss methods in an array
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

type UseIonModalResult = [
  {
    /**
     * Presents the modal
     * @param options - Optional - The options to pass to the IonModal
     */
    (options?: Omit<ModalOptions, 'component' | 'componentProps'> & HookOverlayOptions): void;
  },
  /**
   * Dismisses the modal
   */
  () => void
];
