import { JSX } from '@ionic/core';
import { createOverlayComponent } from './createOverlayComponent';
import { Omit } from '../types';
import { ReactProps } from './ReactProps';

export type PopoverOptions = Omit<JSX.IonPopover, 'component' | 'componentProps'> & {
  children: React.ReactNode;
};

const IonPopover = createOverlayComponent<PopoverOptions & ReactProps, HTMLIonPopoverElement, HTMLIonPopoverControllerElement>('ion-popover', 'ion-popover-controller')
export default IonPopover;
