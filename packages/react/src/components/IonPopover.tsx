import { JSX } from '@ionic/core/components';

import { createInlineOverlayComponent } from './createInlineOverlayComponent'
import { IonPopover as IonPopoverCmp } from '@ionic/core/components/ion-popover.js';

export const IonPopover = /*@__PURE__*/ createInlineOverlayComponent<
  JSX.IonPopover,
  HTMLIonPopoverElement
>('ion-popover', IonPopoverCmp);
