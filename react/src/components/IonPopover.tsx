import { JSX, popoverController } from '@ionic/core';
import { createOverlayComponent } from './createOverlayComponent';
import { Omit } from '../types';
import { ReactProps } from './ReactProps';

export type PopoverOptions = Omit<JSX.IonPopover, 'component' | 'componentProps'> & {
  children: React.ReactNode;
};

export const IonPopover = /*@__PURE__*/createOverlayComponent<PopoverOptions & ReactProps, HTMLIonPopoverElement>('IonPopover', popoverController);
