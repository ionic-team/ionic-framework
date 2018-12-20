import { Components } from '@ionic/core';
import { createOverlayComponent } from './createOverlayComponent';
import { Omit } from './types';

export type PopoverOptions = Omit<Components.IonPopoverAttributes, 'delegate' | 'overlayIndex' | 'component' | 'componentProps'> & {
  children: React.ReactNode;
};

const IonPopover = createOverlayComponent<PopoverOptions, HTMLIonPopoverElement, HTMLIonPopoverControllerElement>('ion-popover', 'ion-popover-controller')
export default IonPopover;
