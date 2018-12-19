import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { Omit } from './types';

export type PopoverOptions = Omit<Components.IonPopoverAttributes, 'overlayIndex'>;

const IonPopover = createControllerComponent<PopoverOptions, HTMLIonPopoverElement, HTMLIonPopoverControllerElement>('ion-popover', 'ion-popover-controller')
export default IonPopover;
