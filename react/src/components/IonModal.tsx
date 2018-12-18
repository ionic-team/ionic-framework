import { ModalOptions } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';

const IonModal = createControllerComponent<ModalOptions, HTMLIonModalElement, HTMLIonModalControllerElement>('ion-alert', 'ion-alert-controller')
export default IonModal;
