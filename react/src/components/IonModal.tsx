import { JSX, modalController } from '@ionic/core';
import { createOverlayComponent } from './createOverlayComponent';
import { Omit } from '../types';
import { ReactProps } from './ReactProps';

export type ModalOptions = Omit<JSX.IonModal,  'component' | 'componentProps'> & {
  children: React.ReactNode;
};

export const IonModal = /*@__PURE__*/createOverlayComponent<ModalOptions & ReactProps, HTMLIonModalElement>('IonModal', modalController)
