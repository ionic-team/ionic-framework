import { Components } from '@ionic/core';
import { createOverlayComponent } from './createOverlayComponent';
import { Omit } from '../types';

export type ModalOptions = Omit<Components.IonModalAttributes,  'component' | 'componentProps'> & {
  children: React.ReactNode;
};

const IonModal = createOverlayComponent<ModalOptions, HTMLIonModalElement, HTMLIonModalControllerElement>('ion-modal', 'ion-modal-controller')
export default IonModal;
