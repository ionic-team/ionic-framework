import type { PopoverOptions } from '@ionic/core/components';
import { popoverController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-popover.js';
import type { ComponentType } from 'react';
import { useCallback } from 'react';

import type { ReactComponentOrElement } from '../models/ReactComponentOrElement';

import type { HookOverlayOptions } from './HookOverlayOptions';
import { useOverlay } from './useOverlay';

// TODO(FW-2959): types

// The `NoInfer` below does the same job as in `useIonModal`. See the note there.

/**
 * A hook for presenting/dismissing an IonPopover component
 * @param component The component that the popover will show. Can be a React Component or a functional component
 * @param componentProps The props that will be passed to the component. Required when the component declares required props
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonPopover<Props extends object>(
  ...args: {} extends Props
    ? [component: ComponentType<Props>, componentProps?: NoInfer<Props>]
    : [component: ComponentType<Props>, componentProps: NoInfer<Props>]
): UseIonPopoverResult;
/**
 * A hook for presenting/dismissing an IonPopover component
 * @param component A JSX Element that the popover will show. Props are already bound to the element, so `componentProps` is not type checked
 * @param componentProps The props that will be passed to the component, if required
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonPopover(component: JSX.Element, componentProps?: any): UseIonPopoverResult;
export function useIonPopover(component: ReactComponentOrElement, componentProps?: any): UseIonPopoverResult {
  const controller = useOverlay<PopoverOptions, HTMLIonPopoverElement>(
    'IonPopover',
    popoverController,
    defineCustomElement,
    component,
    componentProps
  );

  const present = useCallback(
    (options: Omit<PopoverOptions, 'component' | 'componentProps'> & HookOverlayOptions = {}) => {
      controller.present(options as any);
    },
    [controller.present]
  );

  return [present, controller.dismiss];
}

export type UseIonPopoverResult = [
  (options?: Omit<PopoverOptions, 'component' | 'componentProps'> & HookOverlayOptions) => void,
  /**
   * Dismisses the popover
   */
  (data?: any, role?: string) => void
];
