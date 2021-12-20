import { JSX, popoverController } from '@ionic/core/components';

import { createInlineOverlayComponent } from './createInlineOverlayComponent'

export const IonPopover = /*@__PURE__*/ createInlineOverlayComponent<
  JSX.IonPopover,
  HTMLIonPopoverElement
>('ion-popover', popoverController);
