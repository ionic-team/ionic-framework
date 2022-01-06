/* auto-generated vue overlay proxies */

import {
  JSX,
  actionSheetController,
  alertController,
  loadingController,
  pickerController,
  toastController,
} from '@ionic/core/components';

import { defineCustomElement as defineActionSheetCustomElement } from '@ionic/core/components/ion-action-sheet.js'
import { defineCustomElement as defineAlertCustomElement } from '@ionic/core/components/ion-alert.js'
import { defineCustomElement as defineLoadingCustomElement } from '@ionic/core/components/ion-loading.js'
import { defineCustomElement as definePickerCustomElement } from '@ionic/core/components/ion-picker.js'
import { defineCustomElement as defineToastCustomElement } from '@ionic/core/components/ion-toast.js'
import { defineCustomElement as defineModalCustomElement } from '@ionic/core/components/ion-modal.js'
import { defineCustomElement as definePopoverCustomElement } from '@ionic/core/components/ion-popover.js'

import { defineOverlayContainer } from '../vue-component-lib/overlays';

export const IonActionSheet = /*@__PURE__*/ defineOverlayContainer<JSX.IonActionSheet>('ion-action-sheet', defineActionSheetCustomElement, ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'keyboardClose', 'leaveAnimation', 'mode', 'subHeader', 'translucent'], actionSheetController);

export const IonAlert = /*@__PURE__*/ defineOverlayContainer<JSX.IonAlert>('ion-alert', defineAlertCustomElement, ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'inputs', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'subHeader', 'translucent'], alertController);

export const IonLoading = /*@__PURE__*/ defineOverlayContainer<JSX.IonLoading>('ion-loading', defineLoadingCustomElement, ['animated', 'backdropDismiss', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'showBackdrop', 'spinner', 'translucent'], loadingController);

export const IonPicker = /*@__PURE__*/ defineOverlayContainer<JSX.IonPicker>('ion-picker', definePickerCustomElement, ['animated', 'backdropDismiss', 'buttons', 'columns', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'keyboardClose', 'leaveAnimation', 'mode', 'showBackdrop'], pickerController);

export const IonToast = /*@__PURE__*/ defineOverlayContainer<JSX.IonToast>('ion-toast', defineToastCustomElement, ['animated', 'buttons', 'color', 'cssClass', 'duration', 'enterAnimation', 'header', 'htmlAttributes', 'icon', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'position', 'translucent'], toastController);

export const IonModal = /*@__PURE__*/ defineOverlayContainer<JSX.IonModal>('ion-modal', defineModalCustomElement, ['animated', 'backdropBreakpoint', 'backdropDismiss', 'breakpoints', 'enterAnimation', 'handle', 'htmlAttributes', 'initialBreakpoint', 'isOpen', 'keyboardClose', 'leaveAnimation', 'mode', 'presentingElement', 'showBackdrop', 'swipeToClose', 'trigger']);

export const IonPopover = /*@__PURE__*/ defineOverlayContainer<JSX.IonPopover>('ion-popover', definePopoverCustomElement, ['alignment', 'animated', 'arrow', 'backdropDismiss', 'component', 'componentProps', 'dismissOnSelect', 'enterAnimation', 'event', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'mode', 'reference', 'showBackdrop', 'side', 'size', 'translucent', 'trigger', 'triggerAction']);

