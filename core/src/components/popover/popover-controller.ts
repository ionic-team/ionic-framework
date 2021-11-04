import { createController } from "../../utils/overlays";
import type { PopoverOptions } from "./popover-interface";

import { Popover } from "./popover";

export const popoverController = /*@__PURE__*/createController<PopoverOptions, HTMLIonPopoverElement>('ion-popover', Popover);
