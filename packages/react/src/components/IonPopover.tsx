import { PopoverOptions, popoverController } from '@ionic/core';

import { createOverlayComponent } from './createOverlayComponent';

export type ReactPopoverOptions = Omit<PopoverOptions, 'component' | 'componentProps'> & {
  children: React.ReactNode;
};

export const IonPopover = /*@__PURE__*/ createOverlayComponent<
  ReactPopoverOptions,
  HTMLIonPopoverElement
>('IonPopover', popoverController);
