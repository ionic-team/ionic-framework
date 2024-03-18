import type { EventEmitter } from '@stencil/core';

import type { AnimationBuilder, HTMLStencilElement, Mode, Theme } from '../interface';

export interface OverlayEventDetail<T = any> {
  data?: T;
  role?: string;
}

/**
 * The shared configuration options for all overlays.
 */
export interface OverlayOptions {
  /**
   * To change the default appearance of the overlay, use the `theme` option.
   * Mode is used to change the platform behavior of the component.
   */
  mode?: Mode;
  /**
   * The theme determines the visual appearance of components.
   */
  theme?: Theme;
  /**
   * If `true`, the overlay will be animated when it is presented and dismissed.
   */
  animated?: boolean;
  /**
   * The `id` of the overlay.
   */
  id?: string;
  /**
   * The custom enter animation to use for the overlay.
   */
  enterAnimation?: AnimationBuilder;
  /**
   * The custom leave animation to use for the overlay.
   */
  leaveAnimation?: AnimationBuilder;
}

export interface OverlayInterface {
  el: HTMLIonOverlayElement;
  animated: boolean;
  keyboardClose: boolean;
  overlayIndex: number;
  presented: boolean;

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
