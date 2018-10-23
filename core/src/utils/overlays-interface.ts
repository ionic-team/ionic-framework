import { EventEmitter } from '@stencil/core';

import { Animation, AnimationBuilder, Config, Mode } from '../interface';

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
  overlayIndex: number;
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
  dismiss(data?: any, role?: string): Promise<boolean>;
}

export interface OverlayController {
  create(opts?: any): Promise<HTMLElement>;
  dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
  getTop(): Promise<HTMLIonOverlayElement | undefined>;
}

export interface HTMLIonOverlayElement extends HTMLStencilElement {
  overlayIndex: number;
  backdropDismiss?: boolean;

  dismiss(data?: any, role?: string): Promise<boolean>;
}

export type OverlaySelect = HTMLIonActionSheetElement | HTMLIonAlertElement | HTMLIonPopoverElement;

// TODO: uncomment when TS 3.0 issues are fixed
// Overlay checks
/*
export type Conforms<T extends Required<B>, B> = T;
export type HTMLOverlaysElement =
  Conforms<Required<HTMLIonModalElement>, ModalOptions> |
  Conforms<Required<HTMLIonToastElement>, ToastOptions> |
  Conforms<Required<HTMLIonActionSheetElement>, ActionSheetOptions> |
  Conforms<Required<HTMLIonAlertElement>, AlertOptions> |
  Conforms<Required<HTMLIonPopoverElement>, PopoverOptions> |
  Conforms<Required<HTMLIonPickerElement>, PickerOptions> |
  Conforms<Required<HTMLIonLoadingElement>, LoadingOptions>;
*/
