import { createController } from "../../utils/overlays";
import type { ToastOptions } from "./toast-interface";

import { Toast } from "./toast";

export const toastController = /*@__PURE__*/createController<ToastOptions, HTMLIonToastElement>('ion-toast', Toast);
