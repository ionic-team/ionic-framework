import { JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-popover.js';

import { createInlineOverlayComponent } from './createInlineOverlayComponent'

export const IonPopover = /*@__PURE__*/ () => {
  defineCustomElement();
  return createInlineOverlayComponent<
    JSX.IonPopover,
    HTMLIonPopoverElement
  >('ion-popover')
};
