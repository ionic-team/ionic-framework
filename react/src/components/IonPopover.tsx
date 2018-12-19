import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { Omit } from './types';

export type PopoverOptions = Omit<Components.IonPopoverAttributes, 'delegate' | 'overlayIndex' | 'component' | 'componentProps'>;

const IonPopover = createControllerComponent<PopoverOptions, HTMLIonPopoverElement, HTMLIonPopoverControllerElement>('ion-popover', 'ion-popover-controller')
export default IonPopover;
