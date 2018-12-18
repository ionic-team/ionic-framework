import { PopoverOptions } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

const IonPopover = createControllerComponent<PopoverOptions, HTMLIonPopoverElement, HTMLIonPopoverControllerElement>('ion-popover', 'ion-popover-controller')
export default IonPopover;
