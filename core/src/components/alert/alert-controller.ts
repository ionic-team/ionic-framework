import { createController } from "../../utils/overlays";
import type { AlertOptions } from "./alert-interface";

import { Alert } from "./alert";

export const alertController = /*@__PURE__*/createController<AlertOptions, HTMLIonAlertElement>('ion-alert', Alert);
