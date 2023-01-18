/* auto-generated vue overlay proxies */

import {
  JSX,
  actionSheetController,
  alertController,
  loadingController,
  pickerController,
  toastController,
} from '@ionic/core/components';

import { defineCustomElement as defineIonActionSheetCustomElement } from '@ionic/core/components/ion-action-sheet.js'
import { defineCustomElement as defineIonAlertCustomElement } from '@ionic/core/components/ion-alert.js'
import { defineCustomElement as defineIonLoadingCustomElement } from '@ionic/core/components/ion-loading.js'
import { defineCustomElement as defineIonPickerCustomElement } from '@ionic/core/components/ion-picker.js'
import { defineCustomElement as defineIonToastCustomElement } from '@ionic/core/components/ion-toast.js'
import { defineCustomElement as defineIonModalCustomElement } from '@ionic/core/components/ion-modal.js'
import { defineCustomElement as defineIonPopoverCustomElement } from '@ionic/core/components/ion-popover.js'

import { defineOverlayContainer } from '../vue-component-lib/overlays';

export const IonActionSheet = /*@__PURE__*/ defineOverlayContainer<JSX.IonActionSheet>('ion-action-sheet', defineIonActionSheetCustomElement, ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'keyboardClose', 'leaveAnimation', 'mode', 'subHeader', 'translucent'], actionSheetController);
    
export const IonAlert = /*@__PURE__*/ defineOverlayContainer<JSX.IonAlert>('ion-alert', defineIonAlertCustomElement, ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'inputs', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'subHeader', 'translucent'], alertController);
    
export const IonLoading = /*@__PURE__*/ defineOverlayContainer<JSX.IonLoading>('ion-loading', defineIonLoadingCustomElement, ['animated', 'backdropDismiss', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'showBackdrop', 'spinner', 'translucent'], loadingController);
    
export const IonPicker = /*@__PURE__*/ defineOverlayContainer<JSX.IonPicker>('ion-picker', defineIonPickerCustomElement, ['animated', 'backdropDismiss', 'buttons', 'columns', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'keyboardClose', 'leaveAnimation', 'mode', 'showBackdrop'], pickerController);
    
export const IonToast = /*@__PURE__*/ defineOverlayContainer<JSX.IonToast>('ion-toast', defineIonToastCustomElement, ['animated', 'buttons', 'color', 'cssClass', 'duration', 'enterAnimation', 'header', 'htmlAttributes', 'icon', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'position', 'translucent'], toastController);
    
export const IonModal = /*@__PURE__*/ defineOverlayContainer<JSX.IonModal>('ion-modal', defineIonModalCustomElement, ['animated', 'backdropBreakpoint', 'backdropDismiss', 'breakpoints', 'canDismiss', 'enterAnimation', 'handle', 'handleBehavior', 'htmlAttributes', 'initialBreakpoint', 'isOpen', 'keepContentsMounted', 'keyboardClose', 'leaveAnimation', 'mode', 'presentingElement', 'showBackdrop', 'swipeToClose', 'trigger']);
    
export const IonPopover = /*@__PURE__*/ defineOverlayContainer<JSX.IonPopover>('ion-popover', defineIonPopoverCustomElement, ['alignment', 'animated', 'arrow', 'backdropDismiss', 'component', 'componentProps', 'dismissOnSelect', 'enterAnimation', 'event', 'htmlAttributes', 'isOpen', 'keepContentsMounted', 'keyboardClose', 'leaveAnimation', 'mode', 'reference', 'showBackdrop', 'side', 'size', 'translucent', 'trigger', 'triggerAction']);
    
