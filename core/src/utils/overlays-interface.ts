import { EventEmitter } from '@stencil/core';

import { ActionSheetOptions, AlertOptions, Animation, AnimationBuilder, Config, Conforms, LoadingOptions, ModalOptions, Mode, PickerOptions, PopoverOptions, ToastOptions } from '../interface';

export interface OverlayEventDetail<T = any> {
  data?: T;
  role?: string;
}

export interface OverlayInterface {
  mode: Mode;
  el: HTMLElement;
  animated: boolean;
  keyboardClose: boolean;
  config: Config;
  overlayId: number;
  presented: boolean;
  animation?: Animation;
  animationCtrl: HTMLIonAnimationControllerElement;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;

  didPresent: EventEmitter<void>;
  willPresent: EventEmitter<void>;
  willDismiss: EventEmitter<OverlayEventDetail>;
  didDismiss: EventEmitter<OverlayEventDetail>;

  present(): Promise<void>;
  dismiss(data?: any, role?: string): Promise<void>;
}

export interface OverlayController {
  create(opts?: any): Promise<HTMLElement>;
  dismiss(data?: any, role?: string, alertId?: number): Promise<void>;
  getTop(): HTMLElement;
}

export interface HTMLIonOverlayElement extends HTMLStencilElement {
  overlayId: number;
  backdropDismiss?: boolean;

  dismiss(data?: any, role?: string): Promise<void>;
}

// Overlay checks
export type Conforms<T extends Required<B>, B> = T;
export type HTMLOverlaysElement =
  Conforms<HTMLIonModalElement, ModalOptions> |
  Conforms<HTMLIonToastElement, ToastOptions> |
  Conforms<HTMLIonActionSheetElement, ActionSheetOptions> |
  Conforms<HTMLIonAlertElement, AlertOptions> |
  Conforms<HTMLIonPopoverElement, PopoverOptions> |
  Conforms<HTMLIonPickerElement, PickerOptions> |
  Conforms<HTMLIonLoadingElement, LoadingOptions>;
