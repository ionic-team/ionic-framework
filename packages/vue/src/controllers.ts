import {
  modalController,
  popoverController,
  alertController,
  actionSheetController,
  loadingController,
  pickerController,
  toastController,
} from '@ionic/core/components';
import { defineCustomElement } from './utils';
import { VueDelegate } from './framework-delegate';

import { IonModal } from '@ionic/core/components/ion-modal.js'
import { IonPopover } from '@ionic/core/components/ion-popover.js'
import { IonAlert } from '@ionic/core/components/ion-alert.js'
import { IonActionSheet } from '@ionic/core/components/ion-action-sheet.js'
import { IonLoading } from '@ionic/core/components/ion-loading.js'
import { IonPicker } from '@ionic/core/components/ion-picker.js'
import { IonToast } from '@ionic/core/components/ion-toast.js'

const wrapCreateMethod = (
  tagName: string,
  customElement: any,
  controller: any,
  delegate = false
) => {
  const oldCreate = controller.create.bind(controller);
  const delegateCreate = (options: any) => {
    defineCustomElement(tagName, customElement);
    return oldCreate({
      ...options,
      delegate: VueDelegate()
    })
  }
  const noDelegateCreate = (options: any) => {
    defineCustomElement(tagName, customElement);
    return oldCreate({
      ...options
    })
  }

  return (delegate) ? delegateCreate : noDelegateCreate
}

modalController.create = wrapCreateMethod('ion-modal', IonModal, modalController, true);
popoverController.create = wrapCreateMethod('ion-popover', IonPopover, popoverController, true);
alertController.create = wrapCreateMethod('ion-alert', IonAlert, alertController, true);
actionSheetController.create = wrapCreateMethod('ion-action-sheet', IonActionSheet, actionSheetController, true);
loadingController.create = wrapCreateMethod('ion-loading', IonLoading, loadingController, true);
pickerController.create = wrapCreateMethod('ion-picker', IonPicker, pickerController, true);
toastController.create = wrapCreateMethod('ion-toast', IonToast, toastController, true);

export {
  modalController,
  popoverController,
  alertController,
  actionSheetController,
  loadingController,
  pickerController,
  toastController
}
