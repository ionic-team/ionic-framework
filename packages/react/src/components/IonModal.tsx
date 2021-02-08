import { ModalOptions, modalController } from '@ionic/core';

import { createOverlayComponent } from './createOverlayComponent';

export type ReactModalOptions = Omit<ModalOptions, 'component' | 'componentProps'> & {
  children: React.ReactNode;
};

export const IonModal = /*@__PURE__*/ createOverlayComponent<
  ReactModalOptions,
  HTMLIonModalElement
>('IonModal', modalController);
