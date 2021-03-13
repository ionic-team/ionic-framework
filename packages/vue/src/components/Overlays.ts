/* auto-generated vue overlay proxies */

import {
  JSX,
  actionSheetController,
  alertController,
  loadingController,
  modalController,
  pickerController,
  popoverController,
  toastController
} from '@ionic/core';

import { defineOverlayContainer } from '../vue-component-lib/overlays';

export const IonActionSheet = /*@__PURE__*/defineOverlayContainer<JSX.IonActionSheet>('ion-action-sheet', ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'keyboardClose', 'leaveAnimation', 'mode', 'subHeader', 'translucent'], actionSheetController);
    
export const IonAlert = /*@__PURE__*/defineOverlayContainer<JSX.IonAlert>('ion-alert', ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'inputs', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'subHeader', 'translucent'], alertController);
    
export const IonLoading = /*@__PURE__*/defineOverlayContainer<JSX.IonLoading>('ion-loading', ['animated', 'backdropDismiss', 'cssClass', 'duration', 'enterAnimation', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'showBackdrop', 'spinner', 'translucent'], loadingController);
    
export const IonModal = /*@__PURE__*/defineOverlayContainer<JSX.IonModal>('ion-modal', ['animated', 'backdropDismiss', 'component', 'componentProps', 'cssClass', 'enterAnimation', 'keyboardClose', 'leaveAnimation', 'mode', 'presentingElement', 'showBackdrop', 'swipeToClose'], modalController);
    
export const IonPicker = /*@__PURE__*/defineOverlayContainer<JSX.IonPicker>('ion-picker', ['animated', 'backdropDismiss', 'buttons', 'columns', 'cssClass', 'duration', 'enterAnimation', 'keyboardClose', 'leaveAnimation', 'mode', 'showBackdrop'], pickerController);
    
export const IonPopover = /*@__PURE__*/defineOverlayContainer<JSX.IonPopover>('ion-popover', ['animated', 'backdropDismiss', 'component', 'componentProps', 'cssClass', 'enterAnimation', 'event', 'keyboardClose', 'leaveAnimation', 'mode', 'showBackdrop', 'translucent'], popoverController);
    
export const IonToast = /*@__PURE__*/defineOverlayContainer<JSX.IonToast>('ion-toast', ['animated', 'buttons', 'color', 'cssClass', 'duration', 'enterAnimation', 'header', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'position', 'translucent'], toastController);
    
