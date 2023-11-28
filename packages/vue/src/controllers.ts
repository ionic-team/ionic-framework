import {
  modalController as modalCtrl,
  popoverController as popoverCtrl,
  alertController as alertCtrl,
  actionSheetController as actionSheetCtrl,
  loadingController as loadingCtrl,
  pickerController as pickerCtrl,
  toastController as toastCtrl,
} from "@ionic/core/components";
import { defineCustomElement as defineIonActionSheetCustomElement } from "@ionic/core/components/ion-action-sheet.js";
import { defineCustomElement as defineIonAlertCustomElement } from "@ionic/core/components/ion-alert.js";
import { defineCustomElement as defineIonLoadingCustomElement } from "@ionic/core/components/ion-loading.js";
import { defineCustomElement as defineIonModalCustomElement } from "@ionic/core/components/ion-modal.js";
import { defineCustomElement as defineIonPickerCustomElement } from "@ionic/core/components/ion-picker-legacy.js";
import { defineCustomElement as defineIonPopoverCustomElement } from "@ionic/core/components/ion-popover.js";
import { defineCustomElement as defineIonToastCustomElement } from "@ionic/core/components/ion-toast.js";

import { VueDelegate } from "./framework-delegate";

// TODO(FW-2969): types

/**
 * Wrap the controllers export from @ionic/core
 * register the underlying Web Component and
 * (optionally) provide a framework delegate.
 */
const createController: {
  <T>(
    defineCustomElement: () => void,
    oldController: T,
    useDelegate?: boolean
  ): T;
} = (
  defineCustomElement: () => void,
  oldController: any,
  useDelegate = false
) => {
  const delegate = useDelegate ? VueDelegate() : undefined;
  const oldCreate = oldController.create.bind(oldController);
  oldController.create = (options: any) => {
    defineCustomElement();

    return oldCreate({
      ...options,
      delegate,
    });
  };

  return oldController;
};

const modalController = /*@__PURE__*/ createController(
  defineIonModalCustomElement,
  modalCtrl,
  true
);
const popoverController = /*@__PURE__*/ createController(
  defineIonPopoverCustomElement,
  popoverCtrl,
  true
);
const alertController = /*@__PURE__*/ createController(
  defineIonAlertCustomElement,
  alertCtrl
);
const actionSheetController = /*@__PURE__*/ createController(
  defineIonActionSheetCustomElement,
  actionSheetCtrl
);
const loadingController = /*@__PURE__*/ createController(
  defineIonLoadingCustomElement,
  loadingCtrl
);

/**
 * @deprecated Use the inline ion-picker component instead.
 */
const pickerController = /*@__PURE__*/ createController(
  defineIonPickerCustomElement,
  pickerCtrl
);
const toastController = /*@__PURE__*/ createController(
  defineIonToastCustomElement,
  toastCtrl
);

export {
  modalController,
  popoverController,
  alertController,
  actionSheetController,
  loadingController,
  pickerController,
  toastController,
};
