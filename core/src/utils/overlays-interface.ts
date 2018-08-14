import { EventEmitter } from '@stencil/core';

import { Animation, AnimationBuilder, Config, Mode } from '../interface';

export interface OverlayEventDetail<T = any> {
  data?: T;
  role?: string;
}

export interface OverlayInterface {
  mode: Mode;
  el: HTMLElement;
  willAnimate: boolean;
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
  dismiss(data?: any, role?: string): Promise<void>;
}

export type OverlayMap = Map<number, HTMLIonOverlayElement>;
