import type { OverlayOptions } from '@utils/overlays-interface';

import type { ComponentProps, ComponentRef, FrameworkDelegate } from '../../interface';

export interface ModalOptions<T extends ComponentRef = ComponentRef> extends OverlayOptions {
  component: T;
  componentProps?: ComponentProps<T>;
  presentingElement?: HTMLElement;
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  cssClass?: string | string[];
  delegate?: FrameworkDelegate;
  canDismiss?: boolean | ((data?: any, role?: string) => Promise<boolean>);
  keyboardClose?: boolean;
  htmlAttributes?: { [key: string]: any };

  breakpoints?: number[];
  initialBreakpoint?: number;
  backdropBreakpoint?: number;
  handle?: boolean;
  handleBehavior?: ModalHandleBehavior;
}

export interface ModalAnimationOptions {
  presentingEl?: HTMLElement;
  currentBreakpoint?: number;
  backdropBreakpoint?: number;
}

export interface ModalBreakpointChangeEventDetail {
  breakpoint: number;
}

export interface ModalCustomEvent extends CustomEvent {
  target: HTMLIonModalElement;
}

/**
 * The behavior setting for modals when the handle is pressed.
 */
export type ModalHandleBehavior = 'none' | 'cycle';
