import { JSX } from '@ionic/core/components';

import { createInlineOverlayComponent } from './createInlineOverlayComponent'
import { IonModal as IonModalCmp } from '@ionic/core/components/ion-modal.js';

export const IonModal = /*@__PURE__*/ createInlineOverlayComponent<
  JSX.IonModal,
  HTMLIonModalElement
>('ion-modal', IonModalCmp);
