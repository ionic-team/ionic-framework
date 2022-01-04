import { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-modal.js';

import { createInlineOverlayComponent } from './createInlineOverlayComponent'

export const IonModal = /*@__PURE__*/ () => {
  defineCustomElement();
  return createInlineOverlayComponent<
    JSX.IonModal,
    HTMLIonModalElement
  >('ion-modal')
};
