import { ModalOptions } from '@ionic/core';
import { createControllerComponent } from './createControllerComponent';
import { Omit } from './types';

type ModifiedModalOptions = Omit<ModalOptions, 'component' | 'componentProps'>;

const IonModal = createControllerComponent<ModifiedModalOptions, HTMLIonModalElement, HTMLIonModalControllerElement>('ion-modal', 'ion-modal-controller')
export default IonModal;
