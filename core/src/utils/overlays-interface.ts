import type { EventEmitter } from '@stencil/core';

import type { AnimationBuilder, HTMLStencilElement } from '../interface';

import type { BlockerDelegate } from './gesture/gesture-controller';

export interface OverlayEventDetail<T = any> {
  data?: T;
  role?: string;
}

export interface OverlayInterface {
  el: HTMLIonOverlayElement;
  animated: boolean;
  keyboardClose: boolean;
  overlayIndex: number;
  presented: boolean;

  /**
   * Reference to the ion-backdrop element in the overlay shadow DOM.
   */
  backdropEl?: HTMLIonBackdropElement;
  /**
   * Instance of the gesture controller, used to enable and disable scrolling
   * on the main content when the overlay is presented and dismissed.
   */
  blocker?: BlockerDelegate;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;

  didPresent: EventEmitter<void>;
  willPresent: EventEmitter<void>;
  willDismiss: EventEmitter<OverlayEventDetail>;
  didDismiss: EventEmitter<OverlayEventDetail>;

  didPresentShorthand?: EventEmitter<void>;
  willPresentShorthand?: EventEmitter<void>;
  willDismissShorthand?: EventEmitter<OverlayEventDetail>;
  didDismissShorthand?: EventEmitter<OverlayEventDetail>;

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
  lastFocus?: HTMLElement;

  dismiss(data?: any, role?: string): Promise<boolean>;
  present: () => Promise<void>;
}

export type OverlaySelect = HTMLIonActionSheetElement | HTMLIonAlertElement | HTMLIonPopoverElement;
