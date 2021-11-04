import { createController } from "../../utils/overlays";
import type { ModalOptions } from "./modal-interface";

import { Modal } from "./modal";

export const modalController = /*@__PURE__*/createController<ModalOptions, HTMLIonModalElement>('ion-modal', Modal);
