/**
 * This is an autogenerated file created by 'scripts/copy-overlays.js'.
 * Changes made to this file will be overwritten on build.
 */

import type {
  JSX,
} from '@ionic/core/components';

import { defineCustomElement as defineIonActionSheetCustomElement } from '@ionic/core/components/ion-action-sheet.js'
import { defineCustomElement as defineIonAlertCustomElement } from '@ionic/core/components/ion-alert.js'
import { defineCustomElement as defineIonLoadingCustomElement } from '@ionic/core/components/ion-loading.js'
import { defineCustomElement as defineIonPickerLegacyCustomElement } from '@ionic/core/components/ion-picker-legacy.js'
import { defineCustomElement as defineIonToastCustomElement } from '@ionic/core/components/ion-toast.js'
import { defineCustomElement as defineIonModalCustomElement } from '@ionic/core/components/ion-modal.js'
import { defineCustomElement as defineIonPopoverCustomElement } from '@ionic/core/components/ion-popover.js'

import { defineOverlayContainer } from '../vue-component-lib/overlays';

export const IonActionSheet = /*@__PURE__*/ defineOverlayContainer<JSX.IonActionSheet>('ion-action-sheet', defineIonActionSheetCustomElement, ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'mode', 'subHeader', 'theme', 'translucent', 'trigger']);
    
export const IonAlert = /*@__PURE__*/ defineOverlayContainer<JSX.IonAlert>('ion-alert', defineIonAlertCustomElement, ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'inputs', 'isOpen', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'subHeader', 'theme', 'translucent', 'trigger']);
    
export const IonLoading = /*@__PURE__*/ defineOverlayContainer<JSX.IonLoading>('ion-loading', defineIonLoadingCustomElement, ['animated', 'backdropDismiss', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'showBackdrop', 'spinner', 'theme', 'translucent', 'trigger']);
    
export const IonPickerLegacy = /*@__PURE__*/ defineOverlayContainer<JSX.IonPickerLegacy>('ion-picker-legacy', defineIonPickerLegacyCustomElement, ['animated', 'backdropDismiss', 'buttons', 'columns', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'mode', 'showBackdrop', 'theme', 'trigger']);
    
export const IonToast = /*@__PURE__*/ defineOverlayContainer<JSX.IonToast>('ion-toast', defineIonToastCustomElement, ['animated', 'buttons', 'color', 'cssClass', 'duration', 'enterAnimation', 'header', 'htmlAttributes', 'icon', 'isOpen', 'keyboardClose', 'layout', 'leaveAnimation', 'message', 'mode', 'position', 'positionAnchor', 'swipeGesture', 'theme', 'translucent', 'trigger']);
    
export const IonModal = /*@__PURE__*/ defineOverlayContainer<JSX.IonModal>('ion-modal', defineIonModalCustomElement, ['animated', 'backdropBreakpoint', 'backdropDismiss', 'breakpoints', 'canDismiss', 'enterAnimation', 'focusTrap', 'handle', 'handleBehavior', 'htmlAttributes', 'initialBreakpoint', 'isOpen', 'keepContentsMounted', 'keyboardClose', 'leaveAnimation', 'mode', 'presentingElement', 'showBackdrop', 'theme', 'trigger'], true);
    
export const IonPopover = /*@__PURE__*/ defineOverlayContainer<JSX.IonPopover>('ion-popover', defineIonPopoverCustomElement, ['alignment', 'animated', 'arrow', 'backdropDismiss', 'component', 'componentProps', 'dismissOnSelect', 'enterAnimation', 'event', 'focusTrap', 'htmlAttributes', 'isOpen', 'keepContentsMounted', 'keyboardClose', 'leaveAnimation', 'mode', 'reference', 'showBackdrop', 'side', 'size', 'theme', 'translucent', 'trigger', 'triggerAction']);
    
