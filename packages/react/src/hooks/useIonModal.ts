import type { ModalOptions } from '@ionic/core/components';
import { modalController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-modal.js';
import type { ComponentType, ReactElement } from 'react';
import { useCallback } from 'react';

import type { ReactComponentOrElement } from '../models/ReactComponentOrElement';

import type { HookOverlayOptions } from './HookOverlayOptions';
import { useOverlay } from './useOverlay';

// TODO(FW-2959): types

// The `NoInfer` below keeps `componentProps` out of inference, so `Props` comes from
// the component alone. Overlays commonly pass `dismiss` back in through
// `componentProps`, and inferring from it would need the type of `dismiss` while that
// binding is still being declared, which TypeScript rejects as circular. The cost is
// that an inline component with no annotated props resolves to `{}`.

/**
 * A hook for presenting/dismissing an IonModal component
 * @param component The component that the modal will show. Can be a React Component or a functional component
 * @param componentProps The props that will be passed to the component. Required when the component declares required props
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonModal<Props extends object>(
  ...args: {} extends Props
    ? [component: ComponentType<Props>, componentProps?: NoInfer<Props>]
    : [component: ComponentType<Props>, componentProps: NoInfer<Props>]
): UseIonModalResult;
/**
 * A hook for presenting/dismissing an IonModal component
 * @param component A JSX Element that the modal will show. Props are already bound to the element, so `componentProps` is not type checked
 * @param componentProps The props that will be passed to the component, if required
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonModal(component: ReactElement, componentProps?: any): UseIonModalResult;
export function useIonModal(component: ReactComponentOrElement, componentProps?: any): UseIonModalResult {
  const controller = useOverlay<ModalOptions, HTMLIonModalElement>(
    'IonModal',
    modalController,
    defineCustomElement,
    component,
    componentProps
  );

  const present = useCallback(
    (options: Omit<ModalOptions, 'component' | 'componentProps'> & HookOverlayOptions = {}) => {
      controller.present(options as any);
    },
    [controller.present]
  );

  return [present, controller.dismiss];
}

export type UseIonModalResult = [
  (options?: Omit<ModalOptions, 'component' | 'componentProps'> & HookOverlayOptions) => void,
  /**
   * Dismisses the modal
   */
  (data?: any, role?: string) => void
];
