import { PopoverOptions, popoverController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-popover.js';
import { useCallback } from 'react';

import { ReactComponentOrElement } from '../models/ReactComponentOrElement';

import { HookOverlayOptions } from './HookOverlayOptions';
import { useOverlay } from './useOverlay';

// TODO(FW-2959): types

/**
 * A hook for presenting/dismissing an IonPicker component
 * @param component The component that the popover will show. Can be a React Component, a functional component, or a JSX Element
 * @param componentProps The props that will be passed to the component, if required
 * @returns Returns the present and dismiss methods in an array
 */
export function useIonPopover(component: ReactComponentOrElement, componentProps?: any): UseIonPopoverResult {
  const controller = useOverlay<PopoverOptions, HTMLIonPopoverElement>(
    'IonPopover',
    popoverController,
    defineCustomElement,
    component,
    componentProps
  );

  const present = useCallback((options: Omit<PopoverOptions, 'component' | 'componentProps'> & HookOverlayOptions = {}) => {
    controller.present(options as any);
  }, [controller.present]);

  return [
    present,
    controller.dismiss
  ];
}

export type UseIonPopoverResult = [
  (options?: Omit<PopoverOptions, 'component' | 'componentProps'> & HookOverlayOptions) => void,
  /**
   * Dismisses the popover
   */
  (data?: any, role?: string) => void
];
