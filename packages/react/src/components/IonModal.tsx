import { JSX, modalController } from '@ionic/core/components';

import { createInlineOverlayComponent } from './createInlineOverlayComponent'

export const IonModal = /*@__PURE__*/ createInlineOverlayComponent<
  JSX.IonModal,
  HTMLIonModalElement
>('ion-modal', modalController);
