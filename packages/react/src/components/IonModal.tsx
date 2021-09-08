import { JSX } from '@ionic/core/components';
import { IonModal as IonModalCmp } from '@ionic/core/components/ion-modal.js';

import { createInlineOverlayComponent } from './createInlineOverlayComponent'

export const IonModal = /*@__PURE__*/ createInlineOverlayComponent<
  JSX.IonModal,
  HTMLIonModalElement
>('ion-modal', IonModalCmp);
