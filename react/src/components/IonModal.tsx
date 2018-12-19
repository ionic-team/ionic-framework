import { Components } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { Omit } from './types';

export type ModalOptions = Omit<Components.IonModalAttributes, 'delegate' | 'overlayIndex' | 'component' | 'componentProps'>;

const IonModal = createControllerComponent<ModalOptions, HTMLIonModalElement, HTMLIonModalControllerElement>('ion-modal', 'ion-modal-controller')
export default IonModal;
