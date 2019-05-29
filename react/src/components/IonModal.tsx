import { JSX } from '@ionic/core';
import { createOverlayComponent } from './createOverlayComponent';
import { Omit } from '../types';
import { ReactProps } from './ReactProps';

export type ModalOptions = Omit<JSX.IonModal,  'component' | 'componentProps'> & {
  children: React.ReactNode;
};

const IonModal = createOverlayComponent<ModalOptions & ReactProps, HTMLIonModalElement, HTMLIonModalControllerElement>('ion-modal', 'ion-modal-controller')
export default IonModal;
