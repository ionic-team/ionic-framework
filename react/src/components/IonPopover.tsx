import { PopoverOptions } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

const IonPopover = createControllerComponent<PopoverOptions, HTMLIonPopoverElement, HTMLIonPopoverControllerElement>('ion-alert', 'ion-alert-controller')
export default IonPopover;
