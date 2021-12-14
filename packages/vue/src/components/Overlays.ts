/* auto-generated vue overlay proxies */

import {
  JSX,
  actionSheetController,
  alertController,
  loadingController,
  pickerController,
  toastController,
} from '@ionic/core/components';

import { IonActionSheet as IonActionSheetCmp } from '@ionic/core/components/ion-action-sheet.js'
import { IonAlert as IonAlertCmp } from '@ionic/core/components/ion-alert.js'
import { IonLoading as IonLoadingCmp } from '@ionic/core/components/ion-loading.js'
import { IonPicker as IonPickerCmp } from '@ionic/core/components/ion-picker.js'
import { IonToast as IonToastCmp } from '@ionic/core/components/ion-toast.js'
import { IonModal as IonModalCmp } from '@ionic/core/components/ion-modal.js'
import { IonPopover as IonPopoverCmp } from '@ionic/core/components/ion-popover.js'

import { defineOverlayContainer } from '../vue-component-lib/overlays';

export const IonActionSheet = /*@__PURE__*/ defineOverlayContainer<JSX.IonActionSheet>('ion-action-sheet', IonActionSheetCmp, ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'keyboardClose', 'leaveAnimation', 'mode', 'subHeader', 'translucent'], actionSheetController);
    
export const IonAlert = /*@__PURE__*/ defineOverlayContainer<JSX.IonAlert>('ion-alert', IonAlertCmp, ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'inputs', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'subHeader', 'translucent'], alertController);
    
export const IonLoading = /*@__PURE__*/ defineOverlayContainer<JSX.IonLoading>('ion-loading', IonLoadingCmp, ['animated', 'backdropDismiss', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'showBackdrop', 'spinner', 'translucent'], loadingController);
    
export const IonPicker = /*@__PURE__*/ defineOverlayContainer<JSX.IonPicker>('ion-picker', IonPickerCmp, ['animated', 'backdropDismiss', 'buttons', 'columns', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'keyboardClose', 'leaveAnimation', 'mode', 'showBackdrop'], pickerController);
    
export const IonToast = /*@__PURE__*/ defineOverlayContainer<JSX.IonToast>('ion-toast', IonToastCmp, ['animated', 'buttons', 'color', 'cssClass', 'duration', 'enterAnimation', 'header', 'htmlAttributes', 'icon', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'position', 'translucent'], toastController);
    
export const IonModal = /*@__PURE__*/ defineOverlayContainer<JSX.IonModal>('ion-modal', IonModalCmp, ['animated', 'backdropBreakpoint', 'backdropDismiss', 'breakpoints', 'enterAnimation', 'handle', 'htmlAttributes', 'initialBreakpoint', 'isOpen', 'keyboardClose', 'leaveAnimation', 'mode', 'presentingElement', 'showBackdrop', 'swipeToClose', 'trigger']);
    
export const IonPopover = /*@__PURE__*/ defineOverlayContainer<JSX.IonPopover>('ion-popover', IonPopoverCmp, ['alignment', 'animated', 'arrow', 'backdropDismiss', 'component', 'componentProps', 'dismissOnSelect', 'enterAnimation', 'event', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'mode', 'reference', 'showBackdrop', 'side', 'size', 'translucent', 'trigger', 'triggerAction']);
    
