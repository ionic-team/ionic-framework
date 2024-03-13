import type { PopoverOptions } from '@ionic/core/components';
import { popoverController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-popover.js';
import { useCallback } from 'react';

import type { ReactComponentOrElement } from '../models/ReactComponentOrElement';

import type { HookOverlayOptions } from './HookOverlayOptions';
import { useOverlay } from './useOverlay';

/**
 * A hook for presenting/dismissing an IonPicker component
 * @param component The component that the popover will show. Can be a React Component, a functional component, or a JSX Element
 * @param componentProps The props that will be passed to the component, if required
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonPopover(component: JSX.Element, componentProps?: any): UseIonPopoverResult;
export function useIonPopover<P extends undefined>(
  component: React.ComponentClass<P> | React.FC<P>
): UseIonPopoverResult;
export function useIonPopover<P extends Record<string, never>>(
  component: React.ComponentClass<P> | React.FC<P>
): UseIonPopoverResult;
export function useIonPopover<P>(
  component: React.ComponentClass<P> | React.FC<P>,
  componentProps: P
): UseIonPopoverResult;
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
