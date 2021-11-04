import { createController } from "../../utils/overlays";
import type { ActionSheetOptions } from "./action-sheet-interface";

import { ActionSheet } from "./action-sheet";

export const actionSheetController = /*@__PURE__*/createController<ActionSheetOptions, HTMLIonActionSheetElement>('ion-action-sheet', ActionSheet);
